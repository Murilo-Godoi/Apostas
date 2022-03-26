import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager
import json


def get_html_elements(url):
    s=Service(GeckoDriverManager().install())
    driver = webdriver.Firefox(service=s)
    driver.get(url)

    time.sleep(10)

    team_elements = driver.find_elements(By.XPATH,'//span[@class = "teamNameEllipsisContainer"]//span')
    odd_elements = driver.find_elements(By.XPATH,'//div[@class = "oddsDisplay"]//div[@class = "odds"]')
    title = driver.find_element(By.XPATH, '//div[@class = "titleWidgetLayout"]//h1').get_attribute('innerHTML')

    return (driver,team_elements, odd_elements, title)


def get_text(element_list):
    text = []
    for i in element_list:
        if i.get_attribute('innerHTML'):
            text.append(i.get_attribute('innerHTML'))
    return text


def create_info(odds, team_names):
    games = []
    k = 0
    j = 0
    if len(odds) == 3*len(team_names)/2:   #verifica se há possibilidade de empate 
        for i in range(0,len(odds),3):
            aux_team_list = [team_names[j],team_names[j+1]]
            aux_odds_list = [odds[i],odds[i+1],odds[i+2]]
            games.append({'jogo':k, 'times':aux_team_list, 'odds':aux_odds_list})
            k += 1
            j += 2
    elif len(odds) == len(team_names):
        for i in range(0,len(team_names),2):
            aux_team_list = [team_names[i],team_names[i+1]]
            aux_odds_list = [odds[i],odds[i+1]]
            games.append({'jogo':k, 'times':aux_team_list, 'odds':aux_odds_list})
            k += 1
    else:
        return 'ta errado'
    return games

def write_file(title, games):
    js1 = json.dumps(games)
    js2 = json.dumps(title)

    file = open('js/games.js','w')
    file.write(f'const title = {js2}\n')
    file.write(f'const games = {js1}')
    file.close


url = 'https://betway.com/pt/sports/grp/basketball/usa/nba'
driver, team_elements, odd_elements, title = get_html_elements(url)
team_names = get_text(team_elements)
odds = get_text(odd_elements)

games = create_info(odds, team_names)

write_file(title, games)

driver.quit()



