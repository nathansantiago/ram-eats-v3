"use client"

import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { LoaderCircle, Minus, Plus } from "lucide-react"
import axios from 'axios';
import { createClient } from "@/utils/supabase/client";
import { MenuGetMenuOutput, MenuStations, MenuItem } from '@/app/models/models';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
  

const Menu: React.FC = () => {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [menu, setMenu] = useState<MenuGetMenuOutput>();
    const [portions, setPortions] = useState(0);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    throw new Error('User is not logged in.');
                }

                const response = await axios.get('http://localhost:8000/menu/get-menu');
                setMenu(response.data);
                setLoading(false);
            } catch(error: any) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: error.message,
                });
                router.push('/');
            }
        }
        fetchMenu();
    }, []);

    function adjustPortion(adjustment: number) {
        setPortions(Math.max(0, Math.min(5, portions + adjustment)))
    }

    function test() {console.log("test")}

    async function addToAccount(item: MenuItem) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('User is not logged in.');
            }

            const userId = session.user.id;
            const response = await axios.post('http://localhost:8000/nutrition_tracker/track-item', {
                "user_uid": userId,
                "option_id": item.option_id,
                "number_of_servings": portions
            });

            if (response.status === 200) {
                toast({
                    variant: "default",
                    title: "Success",
                    description: "Portions added to account successfully.",
                });
            } else {
                throw new Error('Failed to add portions to account.');
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    }

    return (
        loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : (
        <div className='w-full'>
            <Accordion type="single" collapsible>
            {menu && Object.entries(menu.meal_information).map(([stationName, menuItems]: [string, MenuItem[]]) => (
                    <AccordionItem value={stationName}>
                        <AccordionTrigger>{stationName}</AccordionTrigger>
                        <AccordionContent>
                            {menuItems.map((item: MenuItem) => (
                                <Drawer key={item.option_id}>
                                    <DrawerTrigger onClick={() => setPortions(0)} className='text-base underline decoration-muted-foreground'>{item.option_name}</DrawerTrigger>
                                    <div className="mx-auto w-full max-w-sm">
                                    <DrawerContent>
                                    <DrawerHeader>
                                    <DrawerTitle className='text-4xl font-bold text-center'>{item.option_name}</DrawerTitle>
                                        <div className='grid grid-cols-2 text-left pl-4'>
                                        {/* <DrawerDescription>Amount Per Serving: {item.AmountPerServing}</DrawerDescription>
                                        <DrawerDescription>Amount Per Serving ½ cup: {item["AmountPerServing½cup"]}</DrawerDescription> */}
                                            <DrawerDescription className='text-lg'><span className="font-bold">Calories:</span> {item.Calories}</DrawerDescription>
                                            <DrawerDescription className='text-lg'><span className="font-bold">Protein:</span> {item.Protein}g</DrawerDescription>
                                            <DrawerDescription className='text-lg'><span className="font-bold">Total Carbs:</span> {item.TotalCarbohydrate}</DrawerDescription>
                                            <DrawerDescription className='text-lg'><span className="font-bold">Total Fat:</span> {item.TotalFat}g</DrawerDescription>
                                            <DrawerDescription className='text-lg px-4'>Dietary Fiber: {item.DietaryFiber}</DrawerDescription>
                                            <DrawerDescription className='text-lg px-4'>Saturated Fat: {item.SaturatedFat}</DrawerDescription>
                                            <DrawerDescription className='text-lg px-4'>Sugars: {item.Sugars}</DrawerDescription>
                                            <DrawerDescription className='text-lg px-4'>Trans Fat: {item.TransFat}</DrawerDescription>
                                            <DrawerDescription className='text-lg'><span className="font-bold">Iron:</span> {item.Iron}mg</DrawerDescription>
                                            <DrawerDescription className='text-lg'><span className="font-bold">Sodium:</span> {item.Sodium}</DrawerDescription>
                                            <DrawerDescription className='text-lg'><span className="font-bold">Calcium:</span> {item.Calcium}</DrawerDescription>
                                            <DrawerDescription className='text-lg'><span className="font-bold">Vitamin D:</span> {item.VitaminD}mcg</DrawerDescription>
                                            <DrawerDescription className='text-lg'><span className="font-bold">Potassium:</span> {item.Potassium}mg</DrawerDescription>
                                            <DrawerDescription className='text-lg'><span className="font-bold">Cholesterol:</span> {item.Cholesterol}</DrawerDescription>
                                        </div>
                                        {(item.Soy || item.Wheat || item.Sesame) && (
                                                <>
                                                    {item.Soy && <DrawerDescription className='text-lg font-bold'>Contains Soy</DrawerDescription>}
                                                    {item.Wheat && <DrawerDescription className='text-lg font-bold'>Contains Wheat</DrawerDescription>}
                                                    {item.Sesame && <DrawerDescription className='text-lg font-bold'>Contains Sesame</DrawerDescription>}
                                                </>
                                        )}
                                    </DrawerHeader>
                                    <DrawerFooter>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 shrink-0 rounded-full"
                                            onClick={() => adjustPortion(-1)}
                                            disabled={portions <= 0}
                                        >
                                            <Minus />
                                            <span className="sr-only">Decrease</span>
                                        </Button>
                                        <div className="flex-1 text-center">
                                            <div className="text-7xl font-bold tracking-tighter">
                                            {portions}
                                            </div>
                                            <div className="text-[0.70rem] uppercase text-muted-foreground">
                                            Portions Eaten
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 shrink-0 rounded-full"
                                            onClick={() => adjustPortion(1)}
                                            disabled={portions >= 5}
                                        >
                                            <Plus />
                                            <span className="sr-only">Increase</span>
                                        </Button>
                                    </div>
                                    <Button onClick={() => addToAccount(item)}>Add to account</Button>
                                    <DrawerClose>
                                        <Button variant="outline">Close</Button>
                                    </DrawerClose>
                                    </DrawerFooter>
                                    </DrawerContent>
                                    </div>
                                </Drawer>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
            ))}
            </Accordion>
        </div>
        )
    )
}

export default Menu;