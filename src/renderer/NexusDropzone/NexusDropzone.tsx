import * as React from 'react';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import Dropzone from 'react-dropzone';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { createWorker } from 'typed-web-workers';
import { downloadFromPackageLock } from 'node-tgz-downloader/lib/downloader';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Button from '@material-ui/core/Button';
import { Grid, TextField } from '@material-ui/core';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import UploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/SaveAlt';
import axios from 'axios';
import { initialState, INexusDropZoneState } from './types';
import { tgzLogSpy } from '../Utilities/tgzLogSpy';
import { enumerateNpmDependencies } from '../Utilities/enumerateNpmDependencies';
import { openNexusSnackBar } from '../NexusSnackbar';
import { debounce } from '../Utilities/debounce';

const { dialog } = require('electron').remote;
const remote = require('electron').remote;
const app = remote.app;

const tempDir = app.getPath('userData');

const debounceDuration = 16.6;
// const jsonMimeType = 'application/json'; <-- this is not working on windows
const cwd = `${process.cwd()}/`;

type PropsWithStyles = WithStyles<typeof styles>;

const styles = (theme: Theme) =>
  createStyles({
    dropZone: { height: '30%', border: '1px solid black' },
    dropZoneOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff',
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    button: {
      margin: theme.spacing.unit,
    },
  });

const typedWorker = createWorker((input: Promise<void>, cb: (_: string) => void) => {
  input.then().catch(err => console.error(err));
});

class NexusDropzone extends React.Component<PropsWithStyles, INexusDropZoneState> {
  constructor(props: PropsWithStyles) {
    super(props);
    this.state = initialState;
    this.onDrop = this.onDrop.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.getTarballs = this.getTarballs.bind(this);
    this.showSaveDialog = this.showSaveDialog.bind(this);
    this.postToNexus = this.postToNexus.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNexusUrlChange = this.handleNexusUrlChange.bind(this);
    this.handleNexusRepoChange = this.handleNexusRepoChange.bind(this);
  }

  componentDidMount() {
    tgzLogSpy(this.incrementProgress, this.addToTotal, this.state.downloaded);
  }

  // #region drag
  onDragEnter() {
    this.setState({
      dropzoneActive: true,
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false,
    });
  }

  onDrop(files: File[]) {
    this.setState({
      files,
      dropzoneActive: false,
    });
    files.forEach(file => {
      this.getFileContent(file).then(content => {
        this.setState({
          packages: content,
        });
      });
    });
  }
  // #endregion

  getFileContent(file: File) {
    const reader = new FileReader();
    return new Promise<string>(resolve => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsBinaryString(file);
    });
  }

  getTarballs() {
    // TODO: check whether this file is json-parsable
    const packageJson = JSON.parse(this.state.packages);
    typedWorker.postMessage(downloadFromPackageLock(packageJson, tempDir));
  }

  showSnackBar(snackbarMessage: string) {
    openNexusSnackBar(snackbarMessage);
  }

  incrementProgress = debounce((curr: number) => {
    const currentProgress = ((curr + 1) / this.state.total) * 100;
    this.setState({ downloadedPercent: currentProgress });
    if (currentProgress === 100) {
      this.showSnackBar(`${curr + 1} tarballs downloaded`);
    }
  }, debounceDuration);

  decrementProgress = debounce((curr: number) => {
    const currentProgress = ((curr - 1) / this.state.total) * 100;
    this.setState({ downloadedPercent: currentProgress });
    if (currentProgress === 100) {
      this.showSnackBar(`${curr + 1} tarballs uploaded`);
    }
  }, debounceDuration);

  addToTotal = (count: number) => {
    const { total } = this.state;
    this.setState({ total: count + total });
  };

  showSaveDialog() {
    dialog.showOpenDialog({ properties: ['openDirectory'] }, path => {
      if (path) {
        const newPath = `${path}/tarballs`;
        fse
          .move(tempDir, newPath, { overwrite: true })
          .then(() => {
            this.setState(initialState);
            this.showSnackBar(`Moved to ${newPath}`);
            // reset downloaded count
            tgzLogSpy(this.incrementProgress, this.addToTotal, 0);
          })
          .catch(err => {
            this.showSnackBar(JSON.stringify(err));
          });
      } // user cancelled save dialog
    });
  }

  postToNexus() {
    const { username, password, nexusUrl, nexusRepo, total } = this.state;

    // TODO: generalize thie following, for possible maven, nuget support
    const nexusComponentEndPoint = `${nexusUrl}/service/rest/v1/components?repository=${nexusRepo}`;
    // nexus API to search is too unfriendly to do an 'upsert'
    // const nexusSearchAssetEndPoint = `${nexusUrl}/service/rest/v1/search/assets?repository=${nexusRepo}`;
    const packageJson = JSON.parse(this.state.packages);
    const dependencies = enumerateNpmDependencies(packageJson.dependencies);
    const failedPackages: any[] = [];
    let count = total;
    Promise.all(
      dependencies.map(tarball => {
        return new Promise((resolve, reject) => {
          // TODO: throttle/preflight this?
          const file = `${tempDir}/${tarball.name}/${tarball.path}`;
          fs.readFile(file, (error, data) => {
            const formdata = new FormData();
            const blob = new Blob([data]);
            formdata.append('npm.asset', blob, tarball.name);
            axios
              .post(nexusComponentEndPoint, formdata, {
                auth: { username, password },
                headers: { 'Content-Type': 'multipart/form-data' },
              })
              .then(response => {
                // successfully uploaded
                this.decrementProgress(count--);
                resolve();
              })
              .catch(err => {
                if (err.response.data === `Repository does not allow updating assets: ${nexusRepo}`) {
                  // this is expected, it means the file already exists on nexus,
                  // since nexus doesn't give a better message
                  // reduce the progressbar each time we reach here
                  this.decrementProgress(count--);
                  resolve();
                } else {
                  // unexpected errors.. snackbar to screen
                  failedPackages.push(`${tarball.name}-${tarball.version}`);
                  this.decrementProgress(count--);
                  resolve();
                }
              });
          });
        });
      })
    )
      .then(() => {
        this.setState({
          packagesWithError: failedPackages,
        });
        this.showSnackBar(`${count}/${total} tarballs uploaded`);
      })
      .catch(err => console.error(err));
  }

  // #region event handlers
  handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      username: event.target.value,
    });
  }

  handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      password: event.target.value,
    });
  }

  handleNexusUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      nexusUrl: event.target.value,
    });
  }

  handleNexusRepoChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      nexusRepo: event.target.value,
    });
  }

  // #endregion

  render() {
    const { classes } = this.props;
    const {
      files,
      dropzoneActive,
      downloadedPercent,
      packagesWithError,
      username,
      password,
      nexusUrl,
      nexusRepo,
    } = this.state;
    const FailedPackagesComponent = () => {
      let component;
      const fa = packagesWithError.map(val => `${val}\r\n`);
      if (fa.length !== 0) {
        component = (
          <Grid container={true}>
            <TextField
              fullWidth={true}
              rows={15}
              id="failedPackages"
              label="Failed packages"
              variant="filled"
              multiline={true}
              contentEditable={false}
              name="failedPackages"
              value={fa}
            />
          </Grid>
        );
      } else {
        component = <div />;
      }
      return component;
    };

    return (
      <React.Fragment>
        <Dropzone
          // accept={jsonMimeType} // bug fix for damn windows not associating json type properly
          // tslint:disable-next-line:jsx-no-bind
          onDrop={this.onDrop.bind(this)}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          className={classes.dropZone}
        >
          {dropzoneActive && <div className={classes.dropZoneOverlay}>Drop files...</div>}
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <h2>Drop package-lock.json here</h2>
            </Grid>
            <Grid container={true}>
              <Grid item={true} xs={12}>
                {files.map(f => (
                  <div key={f.name}>
                    {f.name} - {f.size} bytes
                    <LinearProgress color="secondary" variant="determinate" value={this.state.downloadedPercent} />
                  </div>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Dropzone>
        <Grid container={true}>
          <Button
            disabled={files.length === 0}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.getTarballs}
          >
            Get tarballs
            <DownloadIcon className={classes.rightIcon} />
          </Button>
          <Button
            disabled={downloadedPercent !== 100}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.showSaveDialog}
          >
            Save as
            <SaveIcon className={classes.rightIcon} />
          </Button>
          <Button
            disabled={downloadedPercent !== 100}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.postToNexus}
          >
            Upload to nexus
            <UploadIcon className={classes.rightIcon} />
          </Button>
        </Grid>
        <Grid container={true}>
          <TextField
            id="nexus-username"
            variant="outlined"
            required={true}
            label="Username"
            defaultValue={username}
            name="userName"
            onChange={this.handleUsernameChange}
          />
          <TextField
            id="nexus-password"
            variant="filled"
            required={true}
            label="Password"
            type="password"
            defaultValue={password}
            name="password"
            onChange={this.handlePasswordChange}
          />
          <TextField
            id="nexus-url"
            variant="standard"
            required={true}
            label="Nexus url"
            defaultValue={nexusUrl}
            name="nexusUrl"
            onChange={this.handleNexusUrlChange}
          />
          <TextField
            id="nexus-repo-name"
            required={true}
            label="Nexus repository name"
            defaultValue={nexusRepo}
            name="nexusRepo"
            onChange={this.handleNexusRepoChange}
          />
        </Grid>
        <FailedPackagesComponent />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(NexusDropzone);
