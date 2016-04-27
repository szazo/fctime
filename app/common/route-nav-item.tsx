import * as React from 'react';

import { NavItem } from 'react-bootstrap';

export class RouteNavItem extends React.Component<{ path: string, indexOnly?: boolean }, {}> {

		static contextTypes = {
				router: React.PropTypes.func.isRequired
		};

		context: {
				router: any;
		}

		render() {
				
				let href = this.context.router.createHref(this.props.path);
				let isActive = this.context.router.isActive(this.props.path, this.props.indexOnly);				

				return <NavItem href={href} active={isActive}>{this.props.children}</NavItem>;
		}
}
