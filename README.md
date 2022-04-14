
# Run app from within Xcode

Ensure node is available globally when using NVM

```bash
ln -s $(which node) /usr/local/bin/node
```
https://stackoverflow.com/questions/44492197/react-native-ios-build-cant-find-node



# Todos

- [x] Test out linking module
- [x] Test out the route `:bookId/tabs/:tabId` to see if tab can have access to both params
- [x] Test out sharing params between parent and children
- [x] Test out redux dev tools with react navigation
- [x] Test out tab and headers. Hiding header / updating header from within tabs
- [x] Test out drawer navigator and whether it could be used as "split view"
  - Can in theory work by toggling the "drawerType", but going to be insanely hacky... Not worth it.
- [x] Test out re-directing to different url
- [ ] Test out how split view works
- [ ] Test out server-rendering
- [ ] Test out react native flipper


# Findings

