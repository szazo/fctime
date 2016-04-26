import * as React from 'react';
import { Grid, Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';

interface TimesheetProps {
		params: any;
}

export class Timesheet extends React.Component<TimesheetProps, {}> {

		static contextTypes = {
				router: React.PropTypes.func.isRequired
		};

		context: {
				router: any;
		}
		
		render() {

				console.log(this.context.router);
//				alert(this.context.router);
				
				let timesheetId = this.props.params.id;
				let href1 = this.context.router.createHref("/timekeeper/timesheet/" + timesheetId);
				let isActive1 = this.context.router.isActive("/timekeeper/timesheet/" + timesheetId + "/", true);
				let href2 = this.context.router.createHref("/timekeeper/timesheet/" + timesheetId + "/props");
				let isActive2 = this.context.router.isActive("/timekeeper/timesheet/" + timesheetId + "/props");
				
				return <Grid fluid>
						<Row>
								<Col md="2" xs="2">
										<Nav stacked bsStyle="pills">
												<NavItem href={href1} active={isActive1}>Időmérő</NavItem>
												<NavItem href={href2} active={isActive2}>Adatok</NavItem>
												<NavItem>Nyomtatás</NavItem>
												<NavItem>Gépátvételek</NavItem>
										</Nav>
								</Col>
								<Col md="10" xs="10">{this.props.children}</Col>
						</Row>
				</Grid>

		}
}
