from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time
import os
import re
import csv


def openUrl():
    driver_path = os.path.join("driver", "chromedriver.exe") 
    print(driver_path)
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service)
    
    driver.get("https://www.zeptonow.com/brand/Too_Yumm!/56977b67-f3de-4692-9cc1-ff897a1cd4e8?spvid=7ae2021b-9b56-4d47-9ce4-defeefdedabb")
    time.sleep(5)
    return driver


def scrollToBottom(driver):
    SCROLL_PAUSE_TIME = 2
    last_height = driver.execute_script("return document.body.scrollHeight")
    last_count = 0

    while True:
        
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight - 2500);")
        time.sleep(SCROLL_PAUSE_TIME)

        cards = driver.find_elements(By.CSS_SELECTOR, 'a[data-testid="product-card"]')
        current_count = len(cards)
        print(f"Loaded {current_count} products...")

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

    # Product ID from href
    href = card.get_attribute('href')
    match = re.search(r'/pvid/([a-f0-9\-]+)', href)
    product_id = match.group(1) if match else None

    # Product Name
    name = card.find_element(By.CSS_SELECTOR, '[data-testid="product-card-name"]').text.strip()

    # Pack Info (like 67g, 1.2kg)
    pack_info = card.find_element(By.CSS_SELECTOR, '[data-testid="product-card-quantity"]').text.strip()

    # Prices
    price_element = card.find_element(By.CSS_SELECTOR, '[data-testid="product-card-price"]')
    price_text = price_element.text.strip().replace('₹', '').replace(',', '')
    discounted_price = price_text if price_text else None

    # MRP (sometimes shown as line-through, optional)
    try:
        mrp = card.find_element(By.CSS_SELECTOR, '.line-through').text.strip().replace('₹', '').replace(',', '')
    except:
        mrp = discounted_price  # fallback

    # Stock Status
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



def main():
    driver = openUrl()
    scrollToBottom(driver)

    brand_name = extractBrandName(driver)
    print(f"Brand: {brand_name}\n")

    cards = driver.find_elements(By.CSS_SELECTOR, 'a[data-testid="product-card"]')
    print(f"Found {len(cards)} product cards.\n")

    all_data = []

    for i, card in enumerate(cards):
        print(f"Extracting Data from Product {i}...")
        try:
            info = extractData(card, i, brand_name)
            all_data.append(info)
        except Exception as e:
            print(f"[ERROR] Card {i + 1}: {e}")

    

    storeData(all_data)
    # driver.quit()


if __name__ == "__main__":
    main()
