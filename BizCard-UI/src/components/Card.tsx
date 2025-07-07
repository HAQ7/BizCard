import {
  CircleArrowRightIcon,
  CornerRightUpIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Card } from "@/types/Card";

export default function Card({
  card,
  isMain = false,
  isClickable = true,
}: {
  card: Card;
  isMain?: boolean;
  isClickable?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-[400px] w-full h-42 perspective-1000">
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div
          style={{
            backgroundColor: card.bgColor,
            color: card.textColor,
          }}
          className={`absolute inset-0 backface-hidden grid place-items-center shadow-card rounded-xl transition-all text-center ${
            isClickable && "cursor-pointer hover:scale-105"
          }`}
        >
          {!isClickable && (
            <div
              onClick={handleFlip}
              className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ color: card.textColor }}
            >
              <Tooltip>
                <TooltipTrigger>
                  <CornerRightUpIcon
                    size={24}
                    className="text-gray-300 cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>Flip</TooltipContent>
              </Tooltip>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{card.displayName}</h2>
            <p className="text-md font-judson">{card.roleName}</p>
            {isMain && (
              <span className="text-sm text-gray-500 mt-2">(Main Card)</span>
            )}
          </div>
        </div>

        {/* Back Side - Only render when not clickable */}
        {!isClickable && (
          <div
            style={{
              backgroundColor: card.bgColor,
              color: card.textColor,
            }}
            className="absolute inset-0 backface-hidden rotate-y-180 grid place-items-center shadow-card rounded-xl text-center"
          >
            <div
              onClick={handleFlip}
              className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ color: card.textColor }}
            >
              <Tooltip>
                <TooltipTrigger>
                  <CornerRightUpIcon
                    size={24}
                    className="text-gray-300 cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>Flip</TooltipContent>
              </Tooltip>
            </div>
            <div className="grid gap-2">
              <h2 className="text-2xl font-bold">Contact</h2>
              <div className="flex justify-center gap-4">
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <a href={"mailto:" + card.email}>
                        <MailIcon
                          size={24}
                          className="text-gray-300 cursor-pointer"
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>Email</TooltipContent>
                  </Tooltip>
                </div>
                {card.phoneNumber && (
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <a href={"tel:" + card.phoneNumber}>
                        <PhoneIcon
                          size={24}
                          className="text-gray-300 cursor-pointer"
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>Phone</TooltipContent>
                  </Tooltip>
                </div>
                  )}
                {card.linkedIn && (
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <a href={card.linkedIn}>
                        <LinkedinIcon
                          size={24}
                          className="text-gray-300 cursor-pointer"
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>LinkedIn</TooltipContent>
                  </Tooltip>
                </div>
                  )}
                {card.x && (
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <a href={card.x}>
                        <XIcon
                          size={24}
                          className="text-gray-300 cursor-pointer"
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>X</TooltipContent>
                  </Tooltip>
                </div>
                  )}
                {card.customURL && card.customURLName && (
                  <div>
                    <Tooltip>
                      <TooltipTrigger>
                        <a href={card.customURL}>
                          <GlobeIcon
                            size={24}
                            className="text-gray-300 cursor-pointer"
                          />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>{card.customURLName}</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
