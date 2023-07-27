import React, { useState } from "react";

const Line = ({ div1Pos, div2Pos, devices }) => {
	console.log(div1Pos, div2Pos);
	const [lineLength, setLineLength] = useState(0);

	// Update the line length whenever the divs' positions change

	const calculateDistance = (x1, y1, x2, y2) => {
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	};

	React.useEffect(() => {
		const newLineLength = calculateDistance(
			div1Pos.x + 25, // Adjust for the center of the div
			div1Pos.y + 25, // Adjust for the center of the div
			div2Pos.x + 25, // Adjust for the center of the div
			div2Pos.y + 25 // Adjust for the center of the div
		);
		setLineLength(newLineLength);
	}, [div1Pos, div2Pos, devices]);

	return (
		<div
			className='line'
			style={{
				top: div1Pos.y + 25, // Adjust for the center of the div
				left: div1Pos.x + 25, // Adjust for the center of the div
				width: lineLength,
				transform: `rotate(${Math.atan2(
					div2Pos.y - div1Pos.y,
					div2Pos.x - div1Pos.x
				)}rad)`,
			}}
		/>
	);
};
export default Line;
