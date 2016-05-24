// Code goes here

var Emitter = function(){};
Emitter.prototype    = {
    on: function(event, fct){
        this._events = this._events || {};
        this._events[event] = this._events[event]    || []; 
        this._events[event].push(fct);
    },
    removeListener: function(event, fct){
        this._events = this._events || {};
        if( event in this._events === false  )    return;
        this._events[event].splice(this._events[event].indexOf(fct), 1);
    },
    emit: function(event /* , args... */){
        this._events = this._events || {};
        if( event in this._events === false  )    return;
        for(var i = 0; i < this._events[event].length; i++){
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
};

var Button = React.createClass({
  getInitialState: function(){
    return {
      color: this.props.color
    };
  },

  componentWillMount: function() {
    this.handleColorChange = function (clickedButton) {
      if (this === clickedButton) return;
      if (this.props.row === clickedButton.props.row) {
        if (this.props.col - 1 === clickedButton.props.col) return this.toggleColor();
        if (this.props.col + 1 === clickedButton.props.col) return this.toggleColor();
      }
      if (this.props.col === clickedButton.props.col) {
        if (this.props.row - 1 === clickedButton.props.row) return this.toggleColor();
        if (this.props.row + 1 === clickedButton.props.row) return this.toggleColor();
      }
    }.bind(this);
    this.props.events.on('changeColor', this.handleColorChange);
  },

  componentWillUnmount: function () {
    this.props.events.removeListener('changeColor', this.handleColorChange);
  },

  changeStyle: function(){
    console.log('got here')
    this.toggleColor(function () {
      console.log('and here', this.props.events)
      this.props.events.emit('changeColor', this);
    }.bind(this));
  },

  toggleColor: function (callback) {
    if (this.state.color === 'red') {
      this.setState({color: 'green'}, callback);
    } else {
      this.setState({color: 'red'}, callback);
    }
  },

  render: function(){
    return (
      <button
          className="cell"
          onClick={this.changeStyle.bind(this)}
          style={{backgroundColor: this.state.color}}>
      </button>
    )
  }
});

var Board = React.createClass({
  getInitialState: function(){
    return {};
  },

  componentWillMount: function() {
    this.events = new Emitter();
  },

  render: function() {
    var k = 0;
    var row = new Array;

    for (var i=0; i<this.props.cols*this.props.rows; i+=Number(this.props.cols)) {
      row[k] = [...Array(Number(this.props.cols)).keys()].map(function(item,index){
        return (
          <Button
              events={this.events}
              color="red"
              row={k}
              col={index}
              key={((Number(this.props.cols)*k)+index)}
              text={((Number(this.props.cols)*k)+index)} />
        );
      }.bind(this));
      k = k + 1;
    };

    return (
        <div className="table">
          {
            row.map(function(_row,index){
              return (
                  <div className="row">
                  {_row}
                  </div>
                )
            })
          }
        </div>
    );
  }
});

React.render(<Board cols="4" rows="5"/>, document.getElementById('example'));
