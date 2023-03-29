import React, { Dispatch, SetStateAction } from "react";
import HeaderBar from "./HeaderBar";

export interface Tab {
	id: string;
	name: string | (() => any);
	render: () => any;
	disabled?: boolean;
}

const Sidebar = ({
	title,
	goBack,
	goBackProps,
	goForward,
	goForwardProps,
	content,
	state,
	tabs,
	children,
	classNames
}: {
	title?: string | (() => any);
	goBack?: () => any;
	goBackProps?: any;
	goForward?: () => any;
	goForwardProps?: any;
	content?: any;
	state: [string, Dispatch<SetStateAction<string>>];
	tabs: Tab[];
	children?: any;
	classNames?: Record<string, string>;
}) => {
	let [visible, setVisible] = state;

	return (
		<aside className={["sidebar", classNames?.root || ""].join(" ")}>
			<div className={["sidebar-container", classNames?.container || ""].join(" ")}>
				<HeaderBar
					title={title}
					goBack={goBack}
					goBackProps={goBackProps}
					goForward={goForward}
					goForwardProps={goForwardProps}
				/>

				<div className={["sidebar-items", classNames?.items || ""].join(" ")}>
					{tabs.map((t) => (
						<button
							key={t.id}
							className={"btn secondary"}
							data-selected={visible == t.id}
							onClick={() => setVisible(t.id)}
							disabled={t.disabled}
						>
							{typeof t.name == "function" ? <t.name /> : t.name}
						</button>
					))}
				</div>
			</div>

			<main className={"sidebar-content"}>
				{children}

				{React.cloneElement(tabs.find((t) => t.id == visible)?.render() || <></>, {
					key: tabs.find((t) => t.id == visible)?.id,
					"data-visible": visible == tabs.find((t) => t.id == visible)?.id
				})}
			</main>
		</aside>
	);
};

export default Sidebar;
