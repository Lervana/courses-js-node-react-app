import { PrismaClient } from '@prisma/client'
import { v4 } from 'uuid'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

const CATEGORIES = [
    'Nibbles',
    'Starters',
    'Salads',
    'Soups',
    'Rice',
    'Vege',
    'Sushi Rolls',
    'Sushi Sets',
    'Drinks',
]

const DISHES = [
    {
        name: 'Small plate',
        price: 28,
        description:
            'Asian Style Fried Wontons pork, Chicken Pinwheels, Squid Rings, Prawn cutlets',
        category: 'Nibbles',
    },
    {
        name: 'Medium plate',
        price: 38,
        description:
            'Thai Noodle Salad, Fish and Chips, Asian Style Fried Wontons pork, Sandwiches, Squid Rings, Prawn cutlets',
        category: 'Nibbles',
    },
    {
        name: 'Large plate',
        price: 48,
        description:
            'Asian Style Fried Wontons pork, Chicken Pinwheels, Squid Rings, Prawn cutlets, Thai Noodle Salad, Fish and Chips, Sandwiches, Mini Arranccini rice balls with dipping sauce',
        category: 'Nibbles',
    },
    {
        name: 'Miso-shiru',
        price: 16,
        description: 'soybean paste, wakame, tofu, chives, mung sprouts',
        category: 'Soups',
    },
    {
        name: 'Miso-sake',
        price: 20,
        description:
            'soybean paste, salmon, wakame, tofu, chives, sesame, mung sprouts',
        category: 'Soups',
    },

    {
        name: 'Wan-tan',
        price: 24,
        description: 'vegetable gyoza dumplings 2 pcs, roasted garlic, sesame',
        category: 'Soups',
    },

    {
        name: 'Vegan Miso Kimchi',
        price: 31,
        description:
            'japanese miso soup based on dashi from konbu leaves, main additions are fried japanese cabbage kimchi',
        category: 'Soups',
    },
    {
        name: 'Hot Kimchi',
        price: 32,
        description:
            'Japanese soup based on fried kimchi cabbage, garlic and Japanese spices',
        category: 'Soups',
    },
    {
        name: 'Banana in tempura wrapped in tamago',
        price: 20,
        description: 'chocolate, roasted almonds',
        category: 'Starters',
    },
    {
        name: 'Shrimp chips in togarashi sprinkles 15 pcs.',
        price: 15,
        category: 'Starters',
    },
    {
        name: 'Ika Tempura squid rings 8 pcs.',
        price: 31,
        description: 'oshinko, cucumber',
        category: 'Starters',
    },
    {
        name: 'Ebi tempura shrimp 3 pcs.',
        price: 27,
        category: 'Starters',
    },
    {
        name: 'Ebi tempura shrimp 5 pcs.',
        price: 38,
        category: 'Starters',
    },
    {
        name: 'Wakame Salad',
        price: 18,
        description:
            'wakame seaweed, cucumber, sesame, carrot, and ginger sauce',
        category: 'Salads',
    },
    {
        name: 'Goma Salad',
        price: 18,
        description: 'salad with pickled algae, sesame',
        category: 'Salads',
    },
    {
        name: 'Edamame Salad',
        price: 18,
        description: 'boiled young soybeans',
        category: 'Salads',
    },
]

async function main() {
    for (const category of CATEGORIES) {
        await prisma.category.upsert({
            create: {
                id: v4(),
                name: category,
            },
            where: {
                name: category,
            },
            update: {},
        })
    }

    for (const dish of DISHES) {
        const categoryId =
            (
                await prisma.category.findFirst({
                    where: { name: dish.category },
                })
            )?.id ?? ''

        await prisma.dish.upsert({
            create: {
                id: v4(),
                name: dish.name,
                description: dish.description,
                price: dish.price,
                categoryId: categoryId,
            },
            where: {
                name: dish.name,
            },
            update: {},
        })
    }

    const SALT = (process.env.PASSWORD_SALT as string) ?? 'XYZ'
    const hash = crypto.createHmac('sha512', SALT)
    hash.update('examplePassword')
    const passwordHash = hash.digest('hex')

    await prisma.user.upsert({
        create: {
            id: v4(),
            email: 'hello@satoru.gojo',
            name: '五条悟',
            password: passwordHash,
        },
        where: {
            email: 'hello@satoru.gojo',
        },
        update: {
            password: passwordHash,
        },
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
