import React, { Component } from 'react';
import "./TextBox.css";
import { Link } from 'react-router-dom';

class TextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      modifiedText: "",
      copied: false,
      currentWord: ""
    };
  }

  

  handleChange = event => {
    const charCount = event.target.value.length;
    if (charCount <= 300) {
      this.setState({ inputValue: event.target.value });
    }
    else {
      event.preventDefault();
      // Show error saying must be less than 300 chars
      alert("Please enter a description of less than 300 characters.");
    }
    
  };

  handleSubmit = event => {
    const wordCount = this.state.inputValue.split(" ").length;
    if (wordCount > 1) {
      event.preventDefault();
      fetch('/textbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputValue: this.state.inputValue })
      })
      .then(response => response.json())
      .then(data => this.setState({modifiedText: data.modifiedText}))
      .catch(error => alert('Error: Could not connect to server.'));
    }
    else { 
      event.preventDefault();
      // Show error saying must be more than one word
      alert("Please enter a description of at least two words.");
    }
  }


  handleSelectBox = async (word) => {
    this.setState({copied: true, currentWord: word});
    navigator.clipboard.writeText(word);
    setTimeout(() => this.setState({copied: false, currentWord: ""}), 1000);

  }

render() {
  let wordBoxes = [];
  if(this.state.modifiedText.length > 0){
    const wordList = this.state.modifiedText.split(",");
    const cleanWords = wordList.map(word => word.replace(/\.$/, ""));
    const capitalizedWords = cleanWords.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    
    wordBoxes = capitalizedWords.map((word, index) => {
      let width = word.length * 10; /* width of each letter is 10px */
      return <div key ={index} className={this.state.copied && this.state.currentWord === word ? "word-box-copied" : "word-box"} style={{width: width}} onClick={() => this.handleSelectBox(word)}>{this.state.copied && this.state.currentWord === word ? "Copied" : word}</div>
  });
  }
    return (
      <div className="container">
        {/*<img src={"/logo.webp"} alt="My Website Logo" className="logo" />*/}
        <form onSubmit={this.handleSubmit}>
          <div className="textbox-container">
            <h3 className="title">What the Word?</h3>
            <textarea className="textbox" type="text" placeholder="Describe the word in up to 300 chars." value={this.state.inputValue} onChange={this.handleChange}/>
            <button className="submit-button" type="submit">Submit</button>
          </div>
        </form>
        <div className='word-box-container'>
          {wordBoxes}
        </div>
        <div>
          <footer>
            <Link to="/">Home</Link>
            <Link to="/blog">Blog</Link>
          </footer>
        </div>
      </div>
      
    );
  }
}

export default TextBox;
