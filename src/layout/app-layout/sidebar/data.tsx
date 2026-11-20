import {
  BrainIcon,
  DollarIcon,
  GlobeIcon,
  LayoutGridIcon,
  SparkIcon,
} from "@/icons";
import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    icon: <LayoutGridIcon className="size-5" aria-hidden="true" />,
    key: "today",
    path: "/",
  },
  {
    icon: <DollarIcon className="size-5" aria-hidden="true" />,
    key: "finance",
    path: "/finance",
  },
  {
    icon: <GlobeIcon className="size-5" aria-hidden="true" />,
    key: "travel",
    path: "/travel",
  },
  {
    icon: <BrainIcon className="size-5" aria-hidden="true" />,
    key: "learning",
    path: "/learning",
  },
  {
    icon: <SparkIcon className="size-5" aria-hidden="true" />,
    key: "agents",
    path: "/agents",
  },
];

export const othersItems: NavItem[] = [];
export const supportItems: NavItem[] = [];
