function ajax(url, success) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.overrideMimeType('application/json; charset=utf-8');
  request.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        success(JSON.parse(this.responseText));
      } else {
        alert('Server error');
      }
    }
  };
  request.send();
  request = null;
}


var Filter = React.createClass({
  render: function() {
    return React.DOM.div({className: 'filter'},
      'Search: ',
      React.DOM.input({value: this.props.filter, onChange: this.filterChanged}),
      React.DOM.button({onClick: this.reset}, 'Reset')
    );
  },

  filterChanged: function(event) {
    this.props.filterChanged(event.target.value);
  },

  reset: function() {
    this.props.filterChanged('');
  }
});


var Image = React.createClass({
  render: function() {
    var file = this.props.file.name;

    return React.DOM.div({className: 'image'},
      React.DOM.a({href: '/pics/' + encodeURIComponent(file), target: '_blank'},
        React.DOM.img({src: '/thumbs/' + encodeURIComponent(file + '.jpg')})
      ),
      file.replace(/\.[a-z0-9]+$/, '')
    );
  }
});


var App = React.createClass({
  getInitialState: function() {
    return {
      filter: null,
      files: []
    };
  },

  componentWillMount: function() {
    ajax('/pics/', this.setFiles);
  },

  setFiles: function(files) {
    this.setState({files: files});
  },

  render: function() {
    return React.DOM.div({className: 'app'},
      React.createElement(Filter, {filter: this.state.filter, filterChanged: this.filterChanged}),

      this.filtered().map(function(file, index) {
        return React.createElement(Image, {key: index, file: file});
      }, this)
    );
  },

  filtered: function() {
    return this.state.files.filter(function(file) {
      return !this.state.filter || file.indexOf(this.state.filter) >= 0;
    }, this);
  },

  filterChanged: function(filter) {
    this.setState({filter: filter});
  }
});

React.render(React.createElement(App), document.getElementById('app'));

