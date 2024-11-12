"use client"

import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import axios from 'axios';
import { supabase } from "@/lib/supabase";
import { MenuGetMenuOutput, MenuStations, MenuItem } from '@/app/models/models';
  

const Menu: React.FC = () => {
    const [menu, setMenu] = useState<MenuGetMenuOutput>();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    throw new Error('User is not logged in.');
                }

                const response = await axios.get('http://localhost:8000/menu/get-menu');
                setMenu(response.data);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        }
        fetchMenu();
    }, []);

    return (
        <div>
            {menu && Object.entries(menu.menu_stations).map(([stationName, menuItems]: [string, MenuItem[]]) => (
                <Accordion key={stationName} type="single" collapsible>
                    <AccordionItem value={stationName}>
                        <AccordionTrigger>{stationName}</AccordionTrigger>
                        <AccordionContent>
                            {menuItems.map((item: MenuItem) => (
                                <p key={item.option_id}>{item.option_name}</p>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </div>
    )
}

export default Menu;