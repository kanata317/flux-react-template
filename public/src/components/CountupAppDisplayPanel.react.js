var React = require('react');

var CountupAppDisplayPanel = React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired
  },
  render: function() {
    return (
      <div>
                { this.props.count }
            </div>
      );
  }
});

module.exports = CountupAppDisplayPanel;
