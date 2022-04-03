import { Panel } from "./Panel";
import React from "react";
import { Worldle } from "../Worldle";
import { Twemoji } from "@teuteuf/react-emoji-render";

interface InfosProps {
  isOpen: boolean;
  close: () => void;
}

export function Infos({ isOpen, close }: InfosProps) {
  return (
    <Panel title="About" isOpen={isOpen} close={close}>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div>
          This website was made to practice{" "}
          <a href="https://worldle.teuteuf.fr">
            <Worldle />
          </a>
          .
        </div>
        <div>
          You have unlimited chances to guess a country. After guessing the
          country on the first try, it is removed from the list of countries.
          However, if you do not get it on the first try, the amount of times
          you need to get it on the first try is incremented. The list can be
          reset and modified in the settings.
        </div>
      </div>
      <div className="space-y-3 text-justify pb-3">
        <div>
          Made by{" "}
          <a
            className="underline"
            href="https://github.com/cbrown0x90"
            target="_blank"
            rel="noopener noreferrer"
          >
            @cbrown0x90
          </a>{" "}
          - (
          <a
            className="underline"
            href="https://github.com/cbrown0x90"
            target="_blank"
            rel="noopener noreferrer"
          >
            source code
          </a>
          )
        </div>

        <div>
          Forked from{" "}
          <a
            className="underline"
            href="https://twitter.com/teuteuf"
            target="_blank"
            rel="noopener noreferrer"
          >
            @teuteuf
          </a>{" "}
          - (
          <a
            className="underline"
            href="https://github.com/teuteuf/worldle/"
            target="_blank"
            rel="noopener noreferrer"
          >
            source code
          </a>
          )
        </div>
        <div>
          Want to support?{" "}
          <a
            className="underline"
            href="https://www.ko-fi.com/teuteuf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twemoji
              text="Buy @teuteuf a coffee! ☕"
              options={{ className: "inline-block" }}
            />
          </a>
        </div>
      </div>
    </Panel>
  );
}
