const fs = require('fs');
const axios = require('axios');
const ExcelJS = require('exceljs');
const csv = require('csv-parser');

async function getData(platform, city_name, area_name, address, pincode, latitude, longitude, store_id, secondary_store_id) {
    try {
        const response = await axios.get('https://www.swiggy.com/api/instamart/item/P7M9WFVLNR/widgets', {
            params: {
                storeId: store_id,
                primaryStoreId: store_id,
                secondaryStoreId: secondary_store_id || ''
            },
            headers: {
                // Keep headers as you already had, but dynamically include lat, lng, address, and platform
                'user-agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
                'cookie': `platform=${platform}; lat=s%3A${latitude}; lng=s%3A${longitude}; address=s%3A${address};`
            }
        });

        console.log(response.data)
        const data = response.data.data.item;
        const variation = data.variations[0];
        const now = new Date();

        return {
            scrape_date: now.toISOString().split('T')[0],
            insert_time: now.toTimeString().split(' ')[0],
            product_id: data.product_id,
            variation_id: variation.id,
            spin_id: variation.spin,
            brand_name: data.brand,
            brand_id: variation.brand_id,
            product_name: variation.display_name,
            pack_of: variation.quantity,
            formatted_packsize: variation.sku_quantity_with_combo,
            weight: variation.weight_in_grams,
            mrp: variation.price.mrp,
            discounted_selling_price: variation.price.offer_price,
            discount_percent: variation.price.offer_applied.product_description,
            in_stock: variation.inventory.in_stock,
            available_quantity: variation.inventory.total,
            max_allowed_quantity: variation.max_allowed_quantity,
            category_id: variation.category_id,
            category_name: variation.category,
            subcategory_name: variation.sub_category,
            supercategory_name: variation.super_category,
            group_id: variation.meta.group,
            Variant_Flag: variation.displayVariant,
            scraped_store_id: variation.store_id,
            source_latitude: latitude,
            source_longitude: longitude,
            source_store_id: store_id,
            source_area: area_name
        };
    } catch (error) {
        console.error('Error fetching data for:', address, '|', error.response?.status || '', error.message);
        return null;
    }
}

async function saveToExcel(allData) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Swiggy Data');

    worksheet.columns = Object.keys(allData[0]).map(key => ({
        header: key,
        key: key,
        width: 22
    }));

    allData.forEach(row => worksheet.addRow(row));

    await workbook.xlsx.writeFile('swiggy_data.xlsx');
    console.log('All data saved to swiggy_data.xlsx');
}

async function main() {
    const results = [];
    fs.createReadStream('to_extract.xlsx')
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', async () => {
            const allData = [];

            for (const row of results) {
                const data = await getData(
                    row.platform,
                    row.city_name,
                    row.area_name,
                    row.address,
                    row.pincode,
                    row.latitude,
                    row.longitude,
                    row.store_id,
                    row.secondary_store_id
                );

                if (data) {
                    allData.push(data);
                }
            }

            if (allData.length) {
                await saveToExcel(allData);
            } else {
                console.log('❗ No data collected.');
            }
        });
}

main();
