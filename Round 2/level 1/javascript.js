const axios = require('axios');
const ExcelJS = require('exceljs');
const fs = require('fs');

async function getData() {
    try {
        const response = await axios.get('https://www.swiggy.com/api/instamart/item/P7M9WFVLNR/widgets', {
            params: {
                storeId: '1386719',
                primaryStoreId: '1386719',
                secondaryStoreId: ''
            },
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/json',
                'if-none-match': 'W/"2475-IXKFnRUq0mBDc+c2M8f48eKn/es"',
                'matcher': 'cgead8ebd8fbefe87faf9e7',
                'priority': 'u=1, i',
                'referrer': 'https://www.swiggy.com/instamart/item/P7M9WFVLNR?storeId=1386719',
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
                'x-build-version': '2.266.0',
                'cookie': '_fbp=fb.1.1735318738899.906385153564996963;__SW=CXsROpfCuDdOS-EX3FNIjd2lIjep8WRJ;_device_id=5cd11ad2-5e9d-b45f-0fbb-c53e090bfa2f;deviceId=s%3A5cd11ad2-5e9d-b45f-0fbb-c53e090bfa2f.SoA6DtbYDsLqh2o%2FsHU2JMOVFVpqEPXHNfAFcsMoLUE; versionCode=1200; platform=web; statusBarHeight=0;bottomOffset=0; genieTrackOn=false; isNative=false; openIMHP=false;isImBottomBarXpEnabled=s%3Atrue.e48T%2B1OIqhnOplwfDLfBpm6ciWJemq9CxKQOhhXd4VA; _swuid=5cd11ad2-5e9d-b45f-0fbb-c53e090bfa2f;_gcl_au=1.1.1355610924.1743273068; _clck=mu2anz%7C2%7Cfuy%7C0%7C1926;_ga_X3K3CELKLV=GS1.1.1744292325.2.1.1744292574.0.0.0;addressId=s%3A.4Wx2Am9WLolnmzVcU32g6YaFDw0QbIBFRj2nkO7P25s;fontsLoaded=1; ally-on=false; stride=;LocSrc=s%3AswgyUL.Dzm1rLPIhJmB3Tl2Xs6141hVZS0ofGP7LGmLXgQOA7Y;lat=s%3A28.6327426.aPaOmz2xcwidB7owgCID%2F422WizhcxAByk6le2RK7XU;lng=s%3A77.2195969.zfal%2BnnHT1wVSKGeHH5e8eSEQr5skAKZkllP%2FVYWYik;address=s%3ANew%20Delhi%2C%20Delhi%20110001%2C%20India.cUgkue5x1t8IicGrZxp3bH3LbpAnzqKsm4ObT8p5CNc; _guest_tid=406a8baa-7968-43ae-a4f4-9f1d8edb5d1b;_is_logged_in=; _gid=GA1.2.1011947035.1746128564;_ga=GA1.1.1778645587.1735318739;userLocation=%7B%22address%22%3A%22New%20Delhi%2C%20Delhi%20110001%2C%20India%22%2C%22lat%22%3A28.6327426%2C%22lng%22%3A77.2195969%2C%22id%22%3A%22%22%2C%22annotation%22%3A%22%22%2C%22name%22%3A%22%22%7D; _ga_YE38MFJRBZ=GS1.1.1746128563.4.0.1746128566.0.0.0;_ga_34JYJ0BCRN=GS1.1.1746128564.19.0.1746128566.0.0.0;tid=s%3A028a4661-f7d5-4eaa-977a-153d2bef88b5.rIpEZfcbA0Bw8U%2BhzXPzK1H8UuC9A3gCDhoerEc551g;sid=s%3Akd47231d-c34f-4c67-b57e-8674d2dbaddb.FNtn0MhrAh5fOV8R2rKrxp2OxLRk5zt5K0cX6WlnOwE;imOrderAttribution={%22entryId%22:%22Mokobara%22%2C%22entryName%22:%22instamartOpenSearch%22}; subplatform=mweb; webBottomBarHeight=64;_ga_0XZC5MS97H=GS1.1.1746184763.36.1.1746184783.0.0.0;_ga_8N8XRG907L=GS1.1.1746184763.60.1.1746184783.0.0.0;_ga_VEG1HFE5VZ=GS1.1.1746184763.26.1.1746184783.0.0.0;aws-waf-token=5b472b66-7b39-46f8-bddd-dc1c1308a468:HgoAckBON8QbAAAA:VQH/YS3z7uKgmMczwXdMvVUrAHSX3kfaPgQ+XpAsBA4vVZwaMlZBRTAlEIvU9Mps1PY4j0ER/tOybhsPXcjnJdSx33TzU5Y8gkr72QrS6Yitpb8PhaT6Hlr0LQSRM1y1duUNP5fPcF1vHudJLipwIH2GXtNUI6wxfasjjKu8Nk/hwGrgFzOLSF3hb9rwIivG/UoryK9cyg7MXAAKjbLWlh1Xni3ntiwYblLRk6najZAw6+9u3heDeOJ1AAEDxyqhp9p2i74='

            }
        });

        const data = response.data.data.item;
        const variation = data.variations[0];
        const currentDate = new Date();
        const now = new Date();


        return {
            scrape_date: currentDate.toISOString().split('T')[0],
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
            scraped_store_id: variation.store_id
        };

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        return null;
    }
}

async function saveToExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Swiggy Data');

    
    worksheet.columns = Object.keys(data).map(key => ({
        header: key,
        key: key,
        width: 22
    }));

    // Add the row
    worksheet.addRow(data);

    // Save to file
    await workbook.xlsx.writeFile('swiggy_data.xlsx');
    console.log('✅ Data saved to swiggy_data.xlsx');
}


async function main(){
    const data = await getData();
    if (data) {
        await saveToExcel(data);
    }
};
main()
