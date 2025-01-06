"use client";;
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./button";
import { RainbowButton } from "./rainbow-button";
import { usePathname, useRouter } from "next/navigation";
import { TbCodePlus } from "react-icons/tb";
import { Plus } from "lucide-react";

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange
}) {
  const [selected, setSelected] = React.useState(null);
  const outsideClickRef = React.useRef(null);
  const path = usePathname();

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null);
    onChange?.(null);
  });

  const handleSelect = (index) => {
    setSelected(index);
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  return (
    (<div
      // ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm",
        className
      )}>
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }
        if (tab.type === "button") {
          return (
            <Link key={tab.title} href={tab.href || "#"}>
              <Button asChild>
                <RainbowButton className="gap-1.5">
                  {tab.title}<Plus size={20}/>
                </RainbowButton>
              </Button>
            </Link>
          )
        }

        const Icon = tab.icon;
        return (
          (
            <Link key={tab.title} href={tab.href || "#"}>
              <motion.button
                key={tab.title}
                variants={buttonVariants}
                initial={false}
                animate="animate"
                custom={selected === index}
                onClick={() => handleSelect(index)}
                transition={transition}
                className={cn(
                  "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
                  selected === index
                    ? cn("bg-muted", activeColor)
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                ,path.includes(tab.href) ? "bg-muted text-foreground" : "")}>
                <Icon size={20} />
                <AnimatePresence initial={false}>
                  {selected === index && (
                    <motion.span
                      variants={spanVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={transition}
                      className="overflow-hidden">
                      {tab.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </Link>)
        );
      })}
    </div>)
  );
}