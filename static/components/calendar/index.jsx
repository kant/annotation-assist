import React from 'react'

class TimeSelectButton extends React.Component{
    constructor(props){
        super(props)
    }

    setTimeState(){
        this.props.onClick(this.props.button_text)
    }

    render(){
        return(
            <div className={this.props.isActive ? "time-range-button clickable active": "time-range-button clickable"}
                onClick={this.setTimeState.bind(this)}>
                {this.props.button_text}
            </div>
        )
    }
}

export default class Calendar extends React.Component{

    constructor(props){
        super(props)

        var overlay = document.createElement("div");
        overlay.setAttribute("class","overlay");

        this.state = {  popUp:false,
                        activeState: "ALL SYSTEMS",
                        overlay: overlay,
                        systems: []
                        }
    }

    submitSelection(){
        this.props.changeDate(this.state.activeState);

    }

    setActiveState(state){
        this.setState({activeState:state});
        this.closePopUp();
    }

    togglePopUp(){
        if (this.state.popUp){
            this.closePopUp()
        }
        else{
            this.openPopUp()
        }
    }

    openPopUp(){
        document.body.appendChild(this.state.overlay);

        this.setState({popUp:true});

    }

    closePopUp(){
        this.setState({popUp:false});
        this.state.overlay.remove()
    }

    getSystems(){
        $.ajax({
            url: '/api/get_systems',
            type: "GET",
            success: function(resp) {
                var systems = ['ALL SYSTEMS'].concat(JSON.parse(resp).systems);
                this.setState({systems:systems});
            }.bind(this)
        })
    }

    componentDidMount() {
        var body = document.body,
            calendar = React.findDOMNode(this.refs.component_wrapper),
            dropdown = React.findDOMNode(this.refs.dropdown);

        document.addEventListener("mouseup",this.closePopUp.bind(this));
        calendar.addEventListener("mouseup",function(event){event.stopPropagation()});
        dropdown.addEventListener("mouseup",this.togglePopUp.bind(this));

        this.getSystems()
    }

    componentWillUnmount() {
        var body = document.body,
            calendar = React.findDOMNode(this.refs.component_wrapper),
            dropdown = React.findDOMNode(this.refs.dropdown);

        document.removeEventListener("mouseup");
        calendar.removeEventListener("mouseup");
        dropdown.removeEventListener("mouseup");
    }

    render(){
        var timeStateSelections = this.state.systems
        console.log(this.state.systems)
        var timeSelectButtons = timeStateSelections.map(function(state){

            return (
                <TimeSelectButton button_text={state}
                                    isActive={this.state.activeState==state}
                                    onClick={this.setActiveState.bind(this)}/>
            )
        }.bind(this));

        return(
            <div className="calendar-component-wrapper" ref='component_wrapper' tabIndex="-1">
                <div className="calendar-dropdown" ref='dropdown'>
                    <span className="icon-calendar icon"></span>
                    {this.state.activeState}
                    <span className="icon-down-open-big icon"></span>
                    </div>
                <div className='calendar-component' style={{display:this.state.popUp ? '':'none'}}>
                    <div className="calendar-component-right">
                        <div className='button-container'>
                            {timeSelectButtons}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

