import autoAnimate from "@formkit/auto-animate";
import React, { Dispatch, SetStateAction } from "react";
import HeaderBar from "./HeaderBar";

export interface Tab {
	id: string;
	name: string | (() => any);
	render: () => any;
	disabled?: boolean;
}

const Tabs = ({
	list,
	classNames,
	visible,
	setVisible,
	animated
}: {
	list: Tab[];
	classNames?: any;
	visible: string;
	setVisible: any;
	animated: boolean;
}) => {
	const parentRef = React.createRef<HTMLDivElement>();

	React.useEffect(() => {
		if (parentRef.current && animated) {
			autoAnimate(parentRef.current);
		}
	}, [parentRef]);

	return (
		<div className={["sidebar-items", classNames?.items || ""].join(" ")} ref={parentRef}>
			{list.map((t, index) => {
				return (
					<button
						key={t.id}
						className={"btn secondary"}
						data-selected={visible == t.id}
						onClick={() => setVisible(t.id)}
						disabled={t.disabled}
					>
						{typeof t.name == "function" ? <t.name /> : t.name}
					</button>
				);
			})}
		</div>
	);
};

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
	classNames,
	animatedTabs
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
	animatedTabs?: boolean;
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
					<Tabs
						list={tabs}
						visible={visible}
						setVisible={setVisible}
						animated={!!animatedTabs}
					/>
				</div>
			</div>

			<main className={"sidebar-content"}>
				{children}

				{tabs.map((t) => (
					<>
						{React.cloneElement(t.render() || <></>, {
							key: t.id,
							"data-visible": visible == t.id
						})}
					</>
				))}
			</main>
		</aside>
	);
};

export default Sidebar;
