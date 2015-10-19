import React     from 'react';
import moment    from 'moment';
import DateRange from 'moment-range';
import extend    from 'lodash/object/extend'
import Layout    from './data/layout'
import Day       from './day'
import Label     from './label'
import XLabels   from './x-labels'
import YLabels   from './y-labels'

import EventsCollection from './data/events-collection'

class Dayz extends React.Component {

    static EventsCollection = EventsCollection

    static propTypes = {
        display:           React.PropTypes.oneOf(['month', 'week', 'day']),
        date:              React.PropTypes.object.isRequired,
        dayComponent:      React.PropTypes.func,
        events:            React.PropTypes.instanceOf(EventsCollection),
        dayLabelComponent: React.PropTypes.func,
        onDayClick:        React.PropTypes.func,
        onEventClick:      React.PropTypes.func
    }

    static defaultProps = {
        dayLabelComponent: Label,
        dayComponent:      Day,
        display:           'month'
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.calculateLayout(this.props);
    }

    componentWillReceiveProps(nextProps){
        this.calculateLayout(nextProps);
    }

    calculateLayout(props) {
        const range = moment.range( props.date.clone().startOf( props.display ),
                                    props.date.clone().endOf(   props.display ) );
        if ( props.display === 'month' ){
            range.start.subtract(range.start.weekday(), 'days');
            range.end.add(6 - range.end.weekday(), 'days');
        }
        const layout = new Layout(props.events, range, { display: props.display, date: props.date})
        this.setState({ range, layout })
    }


    render() {
        const Day = this.props.dayComponent;
        const classes = ["dayz", this.props.display];
        const days = []

        this.state.range.by('days', (day) =>
            days.push(<Day key={day.format('YYYYMMDD')} day={day} layout={this.state.layout}
                           onClick={this.props.onDayClick} onEventClick={this.props.onEventClick}
                           labelComponent={this.props.dayLabelComponent} />)
        );

        return (
            <div className={classes.join(' ')}>
                <XLabels date={this.props.date} display={this.props.display} />
                <YLabels date={this.props.date} display={this.props.display} />
                <div className="days">{days}</div>
            </div>
        );
    }

}


export default Dayz;