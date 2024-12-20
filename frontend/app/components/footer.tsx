"use server";

import React from 'react';
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu";
import { Home, Utensils, User } from "lucide-react";

const Footer: React.FC = () => {
    return (
        <footer className='py-2'>
            <NavigationMenu>
                <div className="flex gap-2">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                        <Link href="/dashboard/home" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Home/>
                            </NavigationMenuLink>
                        </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                <NavigationMenuList>
                    <NavigationMenuItem>
                    <Link href="/dashboard/menu" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <Utensils/>
                        </NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                        <Link href="/dashboard/settings" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <User/>
                            </NavigationMenuLink>
                        </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </div>
            </NavigationMenu>
        </footer>
    );
};

export default Footer;