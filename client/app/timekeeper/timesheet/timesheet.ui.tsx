import * as React from 'react';
import { Grid, Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { RouteNavItem } from '../../common/route-nav-item';

interface TimesheetProps {
		params: any;
}

export class Timesheet extends React.Component<TimesheetProps, {}> {

		render() {

				let timesheetId = this.props.params.id;
				
				return <Grid fluid>
						<Row>
								<Col md={2} xs={2}>
										<Nav stacked bsStyle="pills">
												<RouteNavItem path={"/timekeeper/timesheet/" + timesheetId} indexOnly>Időmérő</RouteNavItem>
												<RouteNavItem path={"/timekeeper/timesheet/" + timesheetId + "/props"} indexOnly>Adatok</RouteNavItem>
												<NavItem>Nyomtatás</NavItem>
												<NavItem>Gépátvételek</NavItem>
										</Nav>
								</Col>
								<Col md={10} xs={10}>{this.props.children}</Col>
						</Row>
				</Grid>

		}
}
