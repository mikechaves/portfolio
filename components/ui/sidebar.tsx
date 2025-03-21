"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

/* -----------------------------------------------------------------------------
 * Component: Sidebar
 * -------------------------------------------------------------------------- */

const sidebarVariants = cva(
  "relative flex h-full flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground data-[collapsed=true]:w-[--sidebar-width-collapsed] data-[collapsed=false]:w-[--sidebar-width] transition-[width] duration-200 ease-linear",
  {
    variants: {
      variant: {
        default: "",
        opaque: "bg-sidebar/80 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  collapsed?: boolean
  collapsible?: boolean
  collapsedWidth?: number
  width?: number
  onCollapsedChange?: (collapsed: boolean) => void
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      children,
      collapsed = false,
      collapsible = false,
      collapsedWidth = 60,
      width = 240,
      variant,
      onCollapsedChange,
      ...props
    },
    ref,
  ) => {
    const [_collapsed, setCollapsed] = React.useState(collapsed)

    const isCollapsed = collapsed || _collapsed

    React.useEffect(() => {
      setCollapsed(collapsed)
    }, [collapsed])

    return (
      <div
        ref={ref}
        data-collapsed={isCollapsed}
        className={cn(sidebarVariants({ variant, className }))}
        style={{
          "--sidebar-width-collapsed": `${collapsedWidth}px`,
          "--sidebar-width": `${width}px`,
        }}
        {...props}
      >
        {children}
        {collapsible ? (
          <SidebarToggle
            isCollapsed={isCollapsed}
            onClick={() => {
              setCollapsed(!isCollapsed)
              onCollapsedChange?.(!isCollapsed)
            }}
          />
        ) : null}
      </div>
    )
  },
)
Sidebar.displayName = "Sidebar"

/* -----------------------------------------------------------------------------
 * Component: SidebarToggle
 * -------------------------------------------------------------------------- */

interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isCollapsed: boolean
}

const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, isCollapsed, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "absolute bottom-4 right-2 flex h-6 w-6 items-center justify-center rounded-md bg-sidebar-muted text-sidebar-foreground/70 hover:text-sidebar-foreground",
          className,
        )}
        {...props}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"}</span>
      </button>
    )
  },
)
SidebarToggle.displayName = "SidebarToggle"

/* -----------------------------------------------------------------------------
 * Component: SidebarHeader
 * -------------------------------------------------------------------------- */

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={cn(
          "flex h-[--sidebar-header-height] items-center border-b border-sidebar-border px-4 py-2",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarHeader.displayName = "SidebarHeader"

/* -----------------------------------------------------------------------------
 * Component: SidebarBody
 * -------------------------------------------------------------------------- */

const SidebarBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} data-sidebar="body" className={cn("flex-1 overflow-auto", className)} {...props} />
  },
)
SidebarBody.displayName = "SidebarBody"

/* -----------------------------------------------------------------------------
 * Component: SidebarFooter
 * -------------------------------------------------------------------------- */

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="footer"
        className={cn(
          "flex h-[--sidebar-footer-height] items-center border-t border-sidebar-border px-4 py-2",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarFooter.displayName = "SidebarFooter"

/* -----------------------------------------------------------------------------
 * Component: SidebarNav
 * -------------------------------------------------------------------------- */

const SidebarNav = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} data-sidebar="nav" className={cn("flex flex-col gap-1 p-2", className)} {...props} />
  },
)
SidebarNav.displayName = "SidebarNav"

/* -----------------------------------------------------------------------------
 * Component: SidebarNavItem
 * -------------------------------------------------------------------------- */

const sidebarNavItemVariants = cva(
  "group relative flex h-8 w-full items-center rounded-md px-2 text-sm font-medium ring-sidebar-ring transition-colors hover:bg-sidebar-muted hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-sidebar-foreground/70",
        ghost: "text-sidebar-foreground/70",
      },
      active: {
        default: "bg-sidebar-muted text-sidebar-foreground",
        ghost: "bg-transparent text-sidebar-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
    },
  },
)

interface SidebarNavItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof sidebarNavItemVariants> {
  icon?: React.ReactNode
  active?: boolean
  href?: string
  label?: string
  description?: string
  endContent?: React.ReactNode
}

const SidebarNavItem = React.forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  ({ className, children, icon, active, variant, href, label, description, endContent, ...props }, ref) => {
    const Comp = href ? "a" : "button"
    const type = href ? undefined : "button"

    return (
      // @ts-ignore - The `type` prop is valid for button elements, but not for anchor elements
      <Comp
        ref={ref}
        type={type}
        href={href}
        data-sidebar="nav-item"
        data-active={active}
        className={cn(sidebarNavItemVariants({ variant, active, className }))}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label ? (
          <span className="flex-1 truncate" title={label}>
            {label}
          </span>
        ) : (
          children && <span className="flex-1 truncate">{children}</span>
        )}
        {description && (
          <span className="sr-only" aria-hidden="true">
            {description}
          </span>
        )}
        {endContent && <span className="ml-auto">{endContent}</span>}
      </Comp>
    )
  },
)
SidebarNavItem.displayName = "SidebarNavItem"

/* -----------------------------------------------------------------------------
 * Component: SidebarNavItemGroup
 * -------------------------------------------------------------------------- */

const SidebarNavItemGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} data-sidebar="nav-group" className={cn("flex flex-col gap-1", className)} {...props} />
  },
)
SidebarNavItemGroup.displayName = "SidebarNavItemGroup"

/* -----------------------------------------------------------------------------
 * Component: SidebarNavItemGroupLabel
 * -------------------------------------------------------------------------- */

const SidebarNavItemGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarNavItemGroupLabel.displayName = "SidebarNavItemGroupLabel"

export {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
  SidebarNavItemGroup,
  SidebarNavItemGroupLabel,
}

