/* eslint-disable no-console */

// make ramda (and anthing from libraries-generated) available
// via import R from "ramda";
self.importScripts("../js/libraries-generated.js");

import getConsoleOutput from "./getConsoleOutput.js";
import R from "ramda";

import * as babel from "@babel/standalone";

// buffer the response messages and send them all together
// after some wait time
const createArrayBuffer = (func, wait) => {
  let timeout;
  let items = [];

  return (item) => {
    items.push(item);

    const later = () => {
      timeout = null;
      func(items);
      items = [];
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// when we get new code, compile and run it
self.addEventListener("message", (e) => {
  const { code, confirmationId } = e.data;

  // a function to eventually send messages back to the main thread, including the code
  // the code can be used to determine if this message is stale or not
  const respond = createArrayBuffer((messages) => {
    self.postMessage({ messages, code });
  }, 50);

  const assertEquals = (test, target) => {
    const closeEnough =
      R.is(Number, test) &&
      R.is(Number, target) &&
      Math.abs(test - target) < 0.01;

    if (R.equals(test, target) || closeEnough) {
      respond({
        type: "pass",
        message: getConsoleOutput(test),
      });
    } else {
      respond({
        type: "fail",
        message: getConsoleOutput(test) + "\n!==\n" + getConsoleOutput(target),
      });
    }
  };

  const assertFail = (message) => {
    respond({
      type: "fail",
      message: message,
    });
  };

  // hijack any console calls so we can display them on screen
  const hijack = (type) =>
    function () {
      const message = getConsoleOutput(...[].slice.apply(arguments));
      respond({ type, message });
    };

  console.log = hijack("log");
  console.error = hijack("error");
  console.warn = hijack("warn");

  // make sure all the window setIntervals and setTimeouts are clear
  clearAllIntervals();

  try {
    // include module plugin so we can use "import" in the UI
    const transpiled = babel.transform(code, {
      plugins: [babel.availablePlugins["transform-modules-commonjs"]],
      presets: [babel.availablePresets["env"]],
    }).code;

    // setup some functions that can be called from within the
    // code editor
    const evalText = `
      const assert = {};
      assert.equals = ${assertEquals.toString()};
      assert.fail = ${assertFail.toString()};
      ${transpiled}
    `;

    // run the user code
    const result = eval(evalText);

    // if running all the code produces a result, log it
    // ignore if the user's last expression is running a folktale task
    if (!R.isNil(result) && result !== "use strict") {
      console.log(); // add an extra space
      console.log(result);
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    // if the code successfully ran, or an error was caught, send back the confirmationId
    self.postMessage({ confirmationId });
  }
});

// catch any random errors on the page (eg. inside a setTimeout)
self.addEventListener("error", (e) => {
  console.error(e);
});

function clearAllIntervals() {
  // clear any intervals
  // Get a reference to the last interval +1
  const lastIntervalId = setInterval(() => {}, 9999);
  for (let i = 1; i < lastIntervalId; i++) {
    clearInterval(i);
  }
}
