import {CustomerOrder, Order, OrderStatus} from '@/types/orders';
import {DeliveryOrder, DeliveryStatus} from '@/types/delivery';
import {MenuItem} from '@/types/menu';
import {Restaurant} from '@/types/restaurant';
import {Role, User} from "@/types/users";

export const menuItems: MenuItem[] = [
    {id: 'm1', name: 'Masala Dosa', price: 80, available: true, image: '/dosa.jpg'},
    {id: 'm2', name: 'Paneer Tikka', price: 120, available: false, image: '/paneer.jpg'},
    {id: 'm3', name: 'Butter Naan', price: 35, available: true, image: '/naan.jpg'},
    {id: 'm4', name: 'Chole Bhature', price: 90, available: true, image: '/chole.jpg'},
    {id: 'm5', name: 'Veg Biryani', price: 110, available: true, image: '/biryani.jpg'},
    {id: 'm6', name: 'Gulab Jamun', price: 45, available: true, image: '/gulab.jpg'},
    {id: 'm7', name: 'Filter Coffee', price: 30, available: false, image: '/coffee.jpg'},
    {id: 'm8', name: 'Idli Vada Combo', price: 60, available: true, image: '/idli-vada.jpg'},
    {id: 'm9', name: 'Mango Lassi', price: 50, available: true, image: '/lassi.jpg'},
    {id: 'm10', name: 'Tandoori Roti', price: 25, available: true, image: '/roti.jpg'},
    {id: 'm11', name: 'Palak Paneer', price: 130, available: true, image: '/palak.jpg'},
    {id: 'm12', name: 'Samosa (2 pcs)', price: 40, available: true, image: '/samosa.jpg'},
];

export const restaurants: Restaurant[] = [
    {
        id: 'res001',
        name: 'Udupi Cafe',
        cuisine: 'South Indian',
        image: '/images/udupi.jpg',
        menu: [menuItems[0], menuItems[6], menuItems[7]],
    },
    {
        id: 'res002',
        name: 'Spice Villa',
        cuisine: 'North Indian',
        image: '/images/spice.jpg',
        menu: [menuItems[1], menuItems[2], menuItems[10]],
    },
    {
        id: 'res003',
        name: 'Biryani House',
        cuisine: 'Hyderabadi',
        image: '/images/biryani-house.jpg',
        menu: [menuItems[4], menuItems[5], menuItems[9]],
    },
];

export const orders: Order[] = [
    {
        id: 'ORD001',
        customer: 'Ajay',
        items: [
            { restaurantId: 'res001', item: menuItems[0], quantity: 1 }, // Masala Dosa
            { restaurantId: 'res001', item: menuItems[6], quantity: 2 }, // Filter Coffee
        ],
        status: OrderStatus.PENDING,
        total: 150,
    },
    {
        id: 'ORD002',
        customer: 'Sneha',
        items: [
            { restaurantId: 'res002', item: menuItems[1], quantity: 1 }, // Paneer Tikka
            { restaurantId: 'res002', item: menuItems[2], quantity: 1 }, // Butter Naan
        ],
        status: OrderStatus.ACCEPTED,
        total: 155,
    },
    {
        id: 'ORD003',
        customer: 'Rahul',
        items: [
            { restaurantId: 'res003', item: menuItems[4], quantity: 1 }, // Veg Biryani
            { restaurantId: 'res003', item: menuItems[5], quantity: 1 }, // Gulab Jamun
        ],
        status: OrderStatus.PREPARING,
        total: 160,
    },
    {
        id: 'ORD004',
        customer: 'Meera',
        items: [
            { restaurantId: 'res001', item: menuItems[7], quantity: 1 }, // Idli Vada Combo
            { restaurantId: 'res001', item: menuItems[6], quantity: 1 }, // Filter Coffee
        ],
        status: OrderStatus.READY,
        total: 90,
    },
    {
        id: 'ORD005',
        customer: 'Kiran',
        items: [
            { restaurantId: 'res002', item: menuItems[10], quantity: 1 }, // Palak Paneer
            { restaurantId: 'res002', item: menuItems[9], quantity: 1 },  // Tandoori Roti
        ],
        status: OrderStatus.DELIVERED,
        total: 155,
    },
    {
        id: 'ORD006',
        customer: 'Divya',
        items: [
            { restaurantId: 'res003', item: menuItems[3], quantity: 1 }, // Chole Bhature
            { restaurantId: 'res003', item: menuItems[8], quantity: 1 }, // Mango Lassi
        ],
        status: OrderStatus.REJECTED,
        total: 140,
    },
    {
        id: 'ORD007',
        customer: 'Arjun',
        items: [
            { restaurantId: 'res001', item: menuItems[11], quantity: 1 }, // Samosa
            { restaurantId: 'res001', item: menuItems[0], quantity: 1 },  // Masala Dosa
        ],
        status: OrderStatus.PENDING,
        total: 120,
    },
    {
        id: 'ORD008',
        customer: 'Neha',
        items: [
            { restaurantId: 'res003', item: menuItems[4], quantity: 1 }, // Veg Biryani
            { restaurantId: 'res003', item: menuItems[2], quantity: 1 }, // Butter Naan
            { restaurantId: 'res003', item: menuItems[5], quantity: 1 }, // Gulab Jamun
        ],
        status: OrderStatus.CANCELLED_BY_USER,
        total: 195,
    },
];

export const customerOrders: CustomerOrder[] = [
    {
        id: 'ORD001',
        restaurant: 'Udupi Cafe',
        items: [
            {restaurantId: 'res001', item: menuItems[0], quantity: 1},
            {restaurantId: 'res001', item: menuItems[6], quantity: 2},
        ],
        status: OrderStatus.PREPARING,
        eta: '12 mins',
    },
    {
        id: 'ORD002',
        restaurant: 'Spice Villa',
        items: [
            {restaurantId: 'res002', item: menuItems[1], quantity: 1},
            {restaurantId: 'res002', item: menuItems[2], quantity: 2},
        ],
        status: OrderStatus.DELIVERED,
        eta: 'Delivered',
    },
];

export const deliveryOrders: DeliveryOrder[] = [
    {
        id: 'DEL001',
        restaurant: 'Udupi Cafe',
        customer: 'Ajay',
        address: 'MG Road, Mangaluru',
        items: ['Masala Dosa', 'Filter Coffee'],
        status: DeliveryStatus.ASSIGNED,
        eta: '15 mins',
    },
    {
        id: 'DEL002',
        restaurant: 'Spice Villa',
        customer: 'Sneha',
        address: 'Kadri Temple Rd',
        items: ['Paneer Tikka', 'Butter Naan'],
        status: DeliveryStatus.PICKED,
        eta: '8 mins',
    },
    {
        id: 'DEL003',
        restaurant: 'Biryani House',
        customer: 'Rahul',
        address: 'Bejai Main Road',
        items: ['Veg Biryani', 'Gulab Jamun'],
        status: DeliveryStatus.DELIVERED,
        eta: 'Delivered',
    },
    {
        id: 'DEL004',
        restaurant: 'Green Bowl',
        customer: 'Meera',
        address: 'Kankanady Cross',
        items: ['Veg Salad', 'Lemon Juice'],
        status: DeliveryStatus.ASSIGNED,
        eta: '20 mins',
    },
    {
        id: 'DEL005',
        restaurant: 'Coastal Curry',
        customer: 'Kiran',
        address: 'Pumpwell Circle',
        items: ['Fish Curry', 'Steamed Rice'],
        status: DeliveryStatus.PICKED,
        eta: '5 mins',
    },
    {
        id: 'DEL006',
        restaurant: 'Biryani House',
        customer: 'Divya',
        address: 'Lalbagh Road',
        items: ['Hyderabadi Biryani', 'Raita'],
        status: DeliveryStatus.ASSIGNED,
        eta: '12 mins',
    },
    {
        id: 'DEL007',
        restaurant: 'Chaat Street',
        customer: 'Arjun',
        address: 'Car Street, Mangaluru',
        items: ['Pani Puri', 'Dahi Papdi'],
        status: DeliveryStatus.DELIVERED,
        eta: 'Delivered',
    },
    {
        id: 'DEL008',
        restaurant: 'The South Kitchen',
        customer: 'Neha',
        address: 'Bendoorwell Junction',
        items: ['Idli Vada Combo', 'Filter Coffee'],
        status: DeliveryStatus.PICKED,
        eta: '10 mins',
    },
];

export const users: User[] = [
    {
        id: 'USR001',
        name: 'Ajay',
        email: 'ajay@example.com',
        role: Role.customer,
    },
    {
        id: 'USR002',
        name: 'Sneha',
        email: 'sneha@example.com',
        role: Role.restaurant,
    },
    {
        id: 'USR003',
        name: 'Rahul',
        email: 'rahul@example.com',
        role: Role.delivery,
    },
    {
        id: 'USR004',
        name: 'Meera',
        email: 'meera@example.com',
        role: Role.customer,
    },
    {
        id: 'USR005',
        name: 'Kiran',
        email: 'kiran@example.com',
        role: Role.admin,
    },
    {
        id: 'USR006',
        name: 'Divya',
        email: 'divya@example.com',
        role: Role.customer,
    },
    {
        id: 'USR007',
        name: 'Arjun',
        email: 'arjun@example.com',
        role: Role.delivery,
    },
    {
        id: 'USR008',
        name: 'Neha',
        email: 'neha@example.com',
        role: Role.restaurant,
    },
];

