import path from './path'
import icons from './icons'

export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`
    },
    {
        id: 2,
        value: 'PRODUCTS',
        path: `/${path.PRODUCTS}`
    },
    // {
    //     id: 3,
    //     value: 'BLOGS',
    //     path: `/${path.BLOGS}`
    // },
    // {
    //     id: 4,
    //     value: 'OUR SERVICES',
    //     path: `/${path.OUR_SERVICES}`
    // },
    // {
    //     id: 5,
    //     value: 'FAQs',
    //     path: `/${path.FAQ}`
    // },
]

export const productInfoTabs = [
    {
        id: 1,
        name: 'DESCRIPTION',
        content: `Technology: GSM / CDMA / HSPA / EVDO / LTE
Dimensions: 305.7 x 220.6 x 6.9 mm
Weight: 713 g
Display: LED-backlit IPS LCD 12.9 inches
Resolution: 2048 x 2732
OS: iOS 9
Chipset: Apple A9X
CPU: Dual-core 2.26 GHz
Internal: 32/128/256 GB, 4 GB RAM
Camera: 8 MP - 1.2 MP
Circulating in the rumor mill for two years, with a probability of near zero for the better part thereof, the iPad Pro was made official in September 2015 and is shipping worldwide as we speak. Guess we already know what's been going on under the surface but the bottom line is Apple lets you decide about the optional pencil and keyboard.

At 12.9 inches of display diagonal, the iPad Pro is Apple's largest tablet and largest handheld device running iOS, considering there are a couple of smaller MacBooks.

But while size quite obviously matters, there's more to the giant iPad than its sheer scale. A couple of firsts for Apple are also part of the package, though they naturally come at an extra cost.

First up is the Pencil. It's an easy target of ridicule, given Steve Jobs' abhorrence of the stylus, expressed at the original iPhone's launch. However, the Pencil here serves a fundamentally different purpose to a stylus on a smartphone, and the jokes are mostly groundless. The Pencil is an active battery powered device and houses all the tech needed for precise measurement of not only different levels of pressure, but also tilt, so that it's able to reproduce your drawing digitally with all its nuances as you would expect from say, a specialized Wacom tablet.

It's the Smart Keyboard that's more entertaining, however, at least for us. Well, depending on which side of the line you are in the so-called Surface tension. If you need it to, the iPad Pro can be equipped with a foldable keyboard dock/kickstand, which you can buy separately, just like you would the Apple Pencil.

Done with the trivia, the iPad Pro is a seriously capable machine with a huge display, a formidable A9X chip and 4GB of RAM, all powered by an extra large battery.`
    },
    {
        id: 2,
        name: 'WARRANTY',
        content: `WARRANTY INFORMATION
LIMITED WARRANTIES
Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:

Frames Used In Upholstered and Leather Products
Limited Lifetime Warranty
A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`
    },
    {
        id: 3,
        name: 'DELIVERY',
        content: `PURCHASING & DELIVERY
        Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`
    },
    {
        id: 4,
        name: 'PAYMENT',
        content: `PURCHASING & DELIVERY
        Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`
    },
]

export const colors = [
    'black',
    'brown',
    'gray',
    'white',
    'pink',
    'yellow',
    'orange',
    'purple',
    'green',
    'blue',
]

export const sorts = [
    {
        id: 1,
        value: '-sold',
        text: 'Best Selling'
    },
    {
        id: 2,
        value: 'title',
        text: 'Alphabetically, A-Z'
    },
    {
        id: 3,
        value: '-title',
        text: 'Alphabetically, Z-A'
    },
    {
        id: 4,
        value: '-price',
        text: 'Price, High to Low'
    },
    {
        id: 5,
        value: 'price',
        text: 'Price, Low to High'
    },
    {
        id: 6,
        value: '-createdAt',
        text: 'Date, New to Old'
    },
    {
        id: 7,
        value: '-createdAt',
        text: 'Date, Old to New'
    },
]

export const voteOption = [
    {
        id: 1,
        text: 'Terrible'
    },
    {
        id: 2,
        text: 'Bad'
    },
    {
        id: 3,
        text: 'Neutral'
    },
    {
        id: 4,
        text: 'Good'
    },
    {
        id: 5,
        text: 'Perfect'
    },
]

const { FaHome, FaUser, FaProductHunt, FaClipboardList, FaShoppingCart, AiOutlineDashboard } = icons

export const adminSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiOutlineDashboard />
    },
    {
        id: 2,
        type: 'single',
        text: 'User',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <FaUser />
    },
    {
        id: 3,
        type: 'parent',
        text: 'Product',
        submenu: [
            {
                text: 'Create Product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`
            },
            {
                text: 'Manage Product',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`
            },
        ],
        icon: <FaProductHunt />
    },
    {
        id: 4,
        type: 'single',
        text: 'Order',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <FaClipboardList />
    },
    {
        id: 5,
        type: 'single',
        text: 'Back To Home',
        path: `/`,
        icon: <FaHome />
    },
]

export const memberSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Personal',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <FaUser />
    },
    {
        id: 2,
        type: 'single',
        text: 'My Cart',
        path: `/${path.MEMBER}/${path.MYCART}`,
        icon: <FaShoppingCart />
    },
    {
        id: 3,
        type: 'single',
        text: 'Purchase History',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <FaClipboardList />
    },
    {
        id: 4,
        type: 'single',
        text: 'Wishlist',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <FaProductHunt />
    },
    {
        id: 5,
        type: 'single',
        text: 'Back To Home',
        path: `/`,
        icon: <FaHome />
    },
]

export const option = [
    {
        id: 1,
        code: true,
        value: 'Blocked'
    },
    {
        id: 2,
        code: false,
        value: 'Active'
    },
]

export const statusOrder = [
    {
        label: 'Cancelled',
        value: 'Cancelled'
    },
    {
        label: 'Processing',
        value: 'Processing'
    },
    {
        label: 'Succeed',
        value: 'Succeed'
    },
]