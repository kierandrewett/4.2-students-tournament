import { BackIcon } from "./icons/Back";

const HeaderBar = ({ title, goBack }: { title?: string; goBack?: () => any }) => {
	return (
		<header className={"header-bar"}>
			<div className={"header-bar-container"}>
				<div className={"header-bar-button-container"}>
					{goBack && (
						<button className={"btn is-icon"} onClick={goBack}>
							<BackIcon />
						</button>
					)}
				</div>

				{title && (
					<>
						<span className={"header-bar-title"}>{title}</span>
						<span></span>
					</>
				)}
			</div>
		</header>
	);
};

export default HeaderBar;
