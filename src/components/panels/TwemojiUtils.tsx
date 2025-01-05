import React from "react";
import twemoji from "@twemoji/api";

const renderTwemoji = (text: string): string => {
	return twemoji.parse(text, {
		folder: "svg",
		ext: ".svg",
	});
};

interface TwemojiProps {
	text: string;
	className?: string;
}

const Twemoji: React.FC<TwemojiProps> = ({ text, className }) => {
	return (
		<span
			className={className}
			dangerouslySetInnerHTML={{
				__html: renderTwemoji(text),
			}}
		/>
	);
};

export default Twemoji;