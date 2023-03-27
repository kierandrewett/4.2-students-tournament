import { BackIcon } from "./icons/Back";

const HeaderBar = ({
	title,
	cancel,
	cancelText,
	ok,
	okText,
	goBack
}: {
	title?: string;
	cancel?: () => any;
	cancelText?: string;
	ok?: () => any;
	okText?: string;
	goBack?: () => any;
}) => {
	return (
		<header className={"header-bar"}>
			<div className={"header-bar-container"}>
				<div className={"header-bar-button-container"}>
					{cancel && (
						<button className={"btn secondary"} onClick={cancel}>
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
						<button className={"btn primary"} onClick={ok}>
							{okText || "OK"}
						</button>
					)}
				</div>
			</div>
		</header>
	);
};

export default HeaderBar;
