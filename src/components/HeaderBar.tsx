import { BackIcon } from "./icons/Back";

const HeaderBar = ({
	title,
	cancel,
	cancelText,
	cancelProps,
	ok,
	okText,
	okProps,
	goBack
}: {
	title?: string;
	cancel?: (...rest: any) => any;
	cancelText?: string;
	cancelProps?: React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>;
	ok?: (...rest: any) => any;
	okText?: string;
	okProps?: React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>;
	goBack?: (...rest: any) => any;
}) => {
	return (
		<header className={"header-bar"}>
			<div className={"header-bar-container"}>
				<div className={"header-bar-button-container"}>
					{cancel && (
						<button
							{...(cancelProps || {})}
							className={"btn secondary"}
							onClick={cancel}
						>
							{cancelText || "Cancel"}
						</button>
					)}

					{goBack && (
						<button className={"btn is-icon"} onClick={goBack}>
							<BackIcon />
						</button>
					)}
				</div>

				{title && <span className={"header-bar-title"}>{title}</span>}

				<div className={"header-bar-button-container"}>
					{ok && (
						<button {...(okProps || {})} className={"btn primary"} onClick={() => ok()}>
							{okText || "OK"}
						</button>
					)}
				</div>
			</div>
		</header>
	);
};

export default HeaderBar;
