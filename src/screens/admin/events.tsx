export const AdminEvents = (
	rest: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
	return (
		<div {...rest} className="center-container admin-container">
			<div className={"admin-main center-container"}>
				<h1>Events</h1>
				<p>Create, modify or delete events</p>
			</div>

			<div className={"admin-main center-container"}>
				<h3>All Events</h3>

				<table className={"table"}>
					<thead>
						<td>ID</td>
						<td>Name</td>
						<td>Type</td>
						<td>Points Algorithm</td>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
						<tr>
							<td>1</td>
							<td>Running</td>
							<td>Individual</td>
							<td>x=10</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};
