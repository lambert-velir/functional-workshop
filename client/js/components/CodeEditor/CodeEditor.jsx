import React from "react";
import AceEditor from "react-ace";

import { func, number } from "prop-types";

import "brace/mode/javascript";
import "brace/theme/tomorrow";


export default class CodeEditor extends React.Component {

  static propTypes = {
    width: number.isRequired,
    height: number.isRequired,
    onCodeChange: func.isRequired,
    onSizeChange: func.isRequired
  }

  componentDidMount = () => {
    this.measureContainer();

    window.addEventListener("resize", this.measureContainer);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.measureContainer);
  }

  measureContainer = () => {
    const parent = this.ace.refEditor.parentNode;

    this.props.onSizeChange({
      width: parent.offsetWidth,
      height: parent.offsetHeight
    });

  }

  handleChange = (code) => {
    this.props.onCodeChange(code);
  }

  render = () => {
    const { width, height } = this.props;

    return (
      <AceEditor
        ref={el => this.ace = el}
        width={`${width}px`}
        height={`${height}px`}
        mode="javascript"
        theme="tomorrow"
        fontSize={16}
        onChange={this.handleChange}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
      />
    );
  }
}
