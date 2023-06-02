import React, { Component } from "react";
import { FadeLoader } from "react-spinners";

class LoadingAnimation extends Component {
  render() {
    return (
      <div className="loading">
        <FadeLoader
          className="spin"
          size={35}
          color={"#151515"}
          loading={true}
        />
      </div>
    );
  }
}

export default LoadingAnimation;
