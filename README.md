# Nexus-Helper

This is a tool to fetch tarballs from npm, with the option to download them locally or upload to nexus directly.

## To Use

Drag and drop (or click on the dialog) your package-lock.json and click 'Get tarballs'

##

To develop,

```js
npm install
npm start:dev
npm run pack <generates unpackaged binaries for xplat>
npm run dist <packs binaries into installers>
```

- [ ] Prevent multiple clicking of buttons (You can click on get tarballs more than once if you are fast)
- [ ] Persist user settings (username, nexus url, nexus repo name)
- [ ] Unload node-tgz-downloader (it will add the count whenever a new package-lock is added) after successfully downloading
- [ ] Better UI/UX
- [ ] pre-flight auth check
- [ ] Finalize a repo to commit to
- [ ] Decide a boot up window size
- [ ] Light/dark themes?
- [x] Making snackbars dumb
- [x] Handle offline mode more subtlely
- [x] https://electronjs.org/docs/tutorial/debugging-main-process-vscode
- [x] devtools..
- [x] copy index.html without webpack?
- [x] text field requires onchange
- [x] Electron-builder to package for different platforms
- [x] Add script (maybe npm-run-all) to watch and run concurrently
- [ ] no-any
- [ ] some tests maybe?
- [ ] typescript watch is watching tarballs folder
- [ ] https://github.com/lukechilds/keyv/issues/45
