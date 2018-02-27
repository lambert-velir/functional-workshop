import React from "react";
import CodeContainer from "../../containers/CodeContainer.js";
import ImportContainer from "../../containers/ImportContainer.js";

export default class Left extends React.Component {

  render = () => {

    // the editor is only as tall as how many lines it has
    // if the user clicks the area under the editor, focus it
    const focusCodeEditor = e => {
      if (this.codemirror && !this.codemirror.hasFocus()){
        this.codemirror.focus();
        this.codemirror.execCommand("goDocEnd");
      }
    };

    return (
      <div className="panel__code-and-import" onClick={focusCodeEditor} >
        <ImportContainer />
        <CodeContainer editorDidMount={editor => this.codemirror = editor} />
      </div>
    );
  }
}
