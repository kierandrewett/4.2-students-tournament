const Intro = () => {
	return (
		<>
			<div className="center-container intro-container">
				<div className={"intro-main center-container"}>
					<h1>Welcome to the Students Tournament!</h1>
					<p>
						When you are ready to start the entering process, press the Start button
						below.
					</p>

					<button className={"primary"}>Start</button>
				</div>

				<div className={"admin-info-container"}>
					<button className={"secondary"}>Admin Mode</button>
					<small>Some information is missing! Complete setup in admin mode.</small>
				</div>
			</div>
		</>
	);
};

export default Intro;
