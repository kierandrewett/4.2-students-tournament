import { BackIcon } from "./icons/Back";

const HeaderBar = ({
	title,
	cancel,
	cancelText,
	cancelProps,
	ok,
	okText,
	okProps,
	goBack,
	goBackProps,
	goForward,
	goForwardProps
}: {
	title?: string | (() => any);
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
	goForward?: (...rest: any) => any;
	goBackProps?: any;
	goForwardProps?: any;
}) => {
	return (
		<header className={"header-bar"}>
			<div className={"header-bar-container"}>
				<div className={"header-bar-button-container"}>
					{cancel && (
						<button
							className={"btn secondary"}
							onClick={cancel}
							{...(cancelProps || {})}
						>
							{cancelText || "Cancel"}
						</button>
					)}

					{goBack && (
						<button
							{...goBackProps}
							className={"btn is-icon"}
							type={"button"}
							onClick={goBack}
						>
							<BackIcon />
						</button>
					)}
				</div>

				{title && (
					<span className={"header-bar-title"}>
						{typeof title == "function" ? title() : title}
					</span>
				)}

				<div className={"header-bar-button-container"}>
					{ok && (
						<button className={"btn primary"} onClick={() => ok()} {...(okProps || {})}>
							{okText || "OK"}
						</button>
					)}

					{goForward && (
						<button
							{...goForwardProps}
							className={"btn is-icon"}
							type={"button"}
							onClick={goBack}
						>
							<BackIcon style={{ transform: "rotate(180deg)" }} />
						</button>
					)}
				</div>
			</div>
		</header>
	);
};

export default HeaderBar;
