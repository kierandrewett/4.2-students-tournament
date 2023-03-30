import React from "react";
import { store } from "../../../store";

export const AdminFinaliseEnd = () => {
	const [ready, setReady] = React.useState(false);

	const getExcelSpreadsheet = () => {
		store.reports.call("");
	};

	React.useEffect(() => {
		const getAllPromises = () => Promise.all([getExcelSpreadsheet()]);

		getAllPromises().then((_) => {
			setReady(true);
		});
	}, []);

	return ready ? <h1>LOL !!</h1> : <p>loading..</p>;
};
