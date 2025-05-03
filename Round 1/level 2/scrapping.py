from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import os
import re
import csv


def openUrls(urls):
    driver_path = os.path.join("driver", "chromedriver.exe")
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service)

    # Open the first URL
    driver.get(urls[0])
    time.sleep(5)

    # Open remaining URLs in new tabs
    for url in urls[1:]:
        driver.execute_script(f"window.open('{url}', '_blank');")
        time.sleep(3)

    return driver


def changeLocation(driver, pincode):
    try:
        # Step 1: Click the location button
        location_button = driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Select Location"]')
        location_button.click()
        time.sleep(2)

        # Step 2: Enter pincode in the address input box
        search_input = driver.find_element(By.CSS_SELECTOR, 'div[data-testid="address-search-input"] input')
        search_input.clear()
        search_input.send_keys(str(pincode))
        time.sleep(2)

        # Optional: Wait for suggestions to appear and select the first one
        search_input.send_keys(Keys.RETURN)
        time.sleep(5)

        print(f"Location changed to {pincode}")

    except Exception as e:
        print(f"Failed to change location to {pincode}: {e}")

def scrollToBottom(driver):
    SCROLL_PAUSE_TIME = 2
    last_count = 0
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight - 2500);")
        time.sleep(SCROLL_PAUSE_TIME)
        cards = driver.find_elements(By.CSS_SELECTOR, 'a[data-testid="product-card"]')
        current_count = len(cards)
        if current_count == last_count:
            break
        last_count = current_count


def extractBrandName(driver):
    try:
        brand_element = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/div/h1")
        return brand_element.text.strip()
    except Exception as e:
        print(f"Failed to get brand name: {e}")
        return "Unknown"


def extractData(card, index, brand_name):
    data = {}
    href = card.get_attribute('href')
    match = re.search(r'/pvid/([a-f0-9\-]+)', href)
    product_id = match.group(1) if match else None
    name = card.find_element(By.CSS_SELECTOR, '[data-testid="product-card-name"]').text.strip()
    pack_info = card.find_element(By.CSS_SELECTOR, '[data-testid="product-card-quantity"]').text.strip()
    price_element = card.find_element(By.CSS_SELECTOR, '[data-testid="product-card-price"]')
    price_text = price_element.text.strip().replace('\u20b9', '').replace(',', '')
    discounted_price = price_text if price_text else None
    try:
        mrp = card.find_element(By.CSS_SELECTOR, '.line-through').text.strip().replace('\u20b9', '').replace(',', '')
    except:
        mrp = discounted_price
    try:
        card.find_element(By.CSS_SELECTOR, '[data-testid="undefined-add-btn"]')
        stock_status = "In Stock"
    except:
        stock_status = "Out of Stock"

    data.update({
        "position": index + 1,
        "product_id": product_id,
        "product_name": name,
        "brand_name": brand_name,
        "mrp": mrp,
        "discounted_price": discounted_price,
        "stock_status": stock_status,
        "pack_info": pack_info
    })
    return data


def storeData(data, filename="Scraped_data.csv"):
    if not data:
        print("No data to store.")
        return
    keys = data[0].keys()
    with open(filename, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)
    print(f"Data successfully saved to '{filename}'")


def main(urls, pincodes):
    driver = openUrls(urls)
    all_data = []


    for pincode in pincodes:
        for handle in driver.window_handles:
            driver.switch_to.window(handle)
            time.sleep(3)
            changeLocation(driver, pincode)

    # Do not close yet for testing
    input("Press Enter to close browser...")
    driver.quit()
    


if __name__ == "__main__":
    urls = [
        "https://www.zeptonow.com/brand/Too_Yumm!/56977b67-f3de-4692-9cc1-ff897a1cd4e8?spvid=7ae2021b-9b56-4d47-9ce4-defeefdedabb",
        "https://www.zeptonow.com/brand/Lay's/18d6cb72-65aa-4881-8984-a08aa295dd35?spvid=12cdefc2-c4c6-4a74-8b63-cefd3e293a3c"
    ]
    pincodes = [600011, 500070, 411048, 121002, 600041]
    main(urls, pincodes)
