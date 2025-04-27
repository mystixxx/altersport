import React from "react";
import type { ReactNode } from "react";
import { OverlayView } from "@react-google-maps/api";
import Image from "next/image";

export type CustomMarkerProps = {
  position: google.maps.LatLngLiteral;
  onClick?: () => void;
  label?: string;
  isActive?: boolean;
  icon?: ReactNode;
  imageUrl?: string;
};

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  onClick,
  label,
  isActive = false,
  imageUrl,
}) => {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div className="cursor-pointer" onClick={onClick}>
        <div
          className={`relative z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-full transform items-center justify-center rounded-[8px] border-2 shadow-lg ${
            isActive
              ? "border-selected bg-selected"
              : "border-[#AEAEAE] bg-[#AEAEAE]"
          }`}
        >
          <div
            className={`absolute right-3 -bottom-4 z-[-1] h-0 w-0 border-t-[20px] border-r-[10px] border-l-[10px] border-r-transparent border-l-transparent ${
              isActive ? "border-t-selected" : "border-t-[#AEAEAE]"
            }`}
          />

          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={label || "Marker"}
            className="h-full w-full rounded-[8px] object-cover"
            width={48}
            height={48}
          />
        </div>
      </div>
    </OverlayView>
  );
};

export default CustomMarker;
