import React from "react";
import AceEditor from "react-ace";

import { func, string } from "prop-types";

import "brace/mode/javascript";
import "brace/theme/tomorrow";


export default class CodeEditor extends React.Component {

  static propTypes = {
    code: string.isRequired,
    onCodeChange: func.isRequired
  }

  state = {
    width: 0,
    height: 0
  }

  componentDidMount = () => {
    this.resizeSelf();

    window.addEventListener("resize", this.resizeSelf);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizeSelf);
  }

  componentDidUpdate = () => {
    this.resizeSelf();
  }

  resizeSelf = () => {
    const parent = this.ace.refEditor.parentNode;
    const { width, height } = this.state;

    if (parent.offsetWidth !== width || parent.offsetHeight !== height){
      this.setState({
        width: parent.offsetWidth,
        height: parent.offsetHeight
      });
    }
  }

  handleChange = (code) => {
    this.props.onCodeChange(code);
  }

  setupAce = (el) => {
    this.ace = el;

    const commands = this.ace.editor.commands;

    commands.bindKey(
      { win: "Ctrl-D", mac: "Command-D" },
      (editor) => editor.execCommand("selectMoreAfter")
    );

    commands.bindKey(
      { win: "Ctrl-[", mac: "Command-[" },
      (editor) => editor.execCommand("blockoutdent")
    );

    commands.bindKey(
      { win: "Ctrl-]", mac: "Command-]" },
      (editor) => editor.execCommand("blockindent")
    );

    // remove Cmd-L so the browser will select the address bar instead
    commands.bindKey({ win: "Ctrl-L", mac: "Command-L" }, null);

    commands.bindKey({ win: "Ctrl-F", mac: "Command-F" }, null);

  }

  render = () => {
    const { code } = this.props;
    const { width, height } = this.state;

    return (
      <AceEditor
        ref={this.setupAce}
        width={`${width}px`}
        height={`${height}px`}
        mode="javascript"
        theme="tomorrow"
        fontSize={16}
        tabSize={2}
        value={code}
        onChange={this.handleChange}
        wrapEnabled={true}
        name="code-editor"
        editorProps={{ $blockScrolling: Infinity }} // to silence console warning
      />
    );
  }
}
