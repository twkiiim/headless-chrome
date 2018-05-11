
const CDP = require('chrome-remote-interface');
const chromeLauncher = require('chrome-launcher');

let launchedChrome = null;

const launchChrome = () => {
  return chromeLauncher.launch({
    chromeFlags: [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--vmodule',
      '--single-process',
    ],
    logLevel: 'verbose',
  })
  .then((chrome) => {
    console.log(`Headless Chrome launched with debugging port ${chrome.port}`);
    return chrome;
  });
};

const connectChrome = () => {
  return launchChrome()
    .then((chrome) => {
      launchedChrome = chrome;
      return CDP.Version({ port: launchedChrome.port });
    })
    .then(info => console.log('version: ', info))
    .then(() => CDP({ port: launchedChrome.port }))
    .then((client) => {
      console.log('client connected');

      const { DOM, Emulation, Network, Page } = client;

      return Page.enable()
        .then(DOM.enable)
	.then(Network.enable)
	.then(() => {
	  const deviceMetrics = {
	    width: 1280,
	    height: 768,
	    deviceScaleFactor: 0,
	    mobile: false,
	    fitWindow: false,
	  };
	  return Emulation.setDeviceMetricsOverride(deviceMetrics);
    })
    .then(() => Page.navigate({ url: 'https://github.com' }))
    .then(Page.loadEventFired)
    .then(() => Emulation.setVisibleSize({ width: 1280, height: 768}))
    .then(Page.captureScreenshot)
    .then(screenshot => new Buffer(screenshot.data, 'base64'))
    .catch((err) => {
      client.close();
      throw err;
    });
  })
  .catch((err) => {
    console.log(err);
    launchedChrome.kill();
    throw err;
  });
};

module.exports = {
  connectChrome,
};
