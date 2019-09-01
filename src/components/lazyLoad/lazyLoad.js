import React from "react";
import PropTypes from "prop-types";

class LazyLoad extends React.Component {
  constructor(props) {
    super(props);
    this.observeIntersection = this.observeIntersection.bind(this);
    this.startIntersection = this.startIntersection.bind(this);
    this._observer = new IntersectionObserver(this.observeIntersection, {
      root: null,
      threshold: props.threshold
    });
  }

  observeIntersection(entries) {
    const { loadMore } = this.props;
    for (let entry of entries) {
      if (entry.target === this.el && entry.isIntersecting) {
        loadMore(entry);
      }
    }
  }

  componentWillUnmount() {
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  startIntersection(el) {
    if (el && !this.el) {
      this.el = el;
      this._observer.observe(this.el);
    }
  }

  render() {
    return (
      <div
        ref={el => this.startIntersection(el)}
        style={{ background: "transperent", width: "10px", height: "inherit", color: 'transparent', overflow: "hidden", justifySelf: 'flex-end' }}
      >
        Loading...
      </div>
    );
  }
}

LazyLoad.propTypes = {
  loadMore: PropTypes.func,
  threshold: PropTypes.number
};

LazyLoad.defaultProps = {
  loadMore: () => {},
  threshold: 0
};

export default LazyLoad;
