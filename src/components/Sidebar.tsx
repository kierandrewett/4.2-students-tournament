import React, { Dispatch, SetStateAction } from "react";
import HeaderBar from "./HeaderBar";

interface Tab {
	id: string;
	name: string;
	render: () => any;
}

const Sidebar = ({
	title,
	goBack,
	content,
	state,
	tabs,
	children
}: {
	title?: string;
	goBack?: () => any;
	content?: any;
	state: [string, Dispatch<SetStateAction<string>>];
	tabs: Tab[];
	children?: any;
}) => {
	let [visible, setVisible] = state;

	return (
		<aside className={"sidebar"}>
			<div className={"sidebar-container"}>
				<HeaderBar title={title} goBack={goBack} />

				<div className={"sidebar-items"}>
					{tabs.map((t) => (
						<button
							className={"btn secondary"}
							data-selected={visible == t.id}
							onClick={() => setVisible(t.id)}
						>
							{t.name}
						</button>
					))}
				</div>
			</div>

			<main className={"sidebar-content"}>
				{children}

				{tabs.map((t) => {
					const jsx = t.render();

					return React.cloneElement(jsx, { "data-visible": visible == t.id });
				})}
			</main>
		</aside>
	);
};

export default Sidebar;
