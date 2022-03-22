import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.firefox import GeckoDriverManager
import json

url = 'https://betway.com/pt/sports/grp/basketball/usa/nba'

driver = webdriver.Firefox(executable_path=GeckoDriverManager().install())

driver.get(url)

time.sleep(10)

team_element = driver.find_elements(By.XPATH,'//span[@class = "teamNameEllipsisContainer"]//span')
odd_element = driver.find_elements(By.XPATH,'//div[@class = "oddsDisplay"]//div[@class = "odds"]')
title = driver.find_element(By.XPATH, '//div[@class = "titleWidgetLayout"]//h1').get_attribute('innerHTML')


team_names = []
for i in team_element:
    if i.get_attribute('innerHTML'):
        team_names.append(i.get_attribute('innerHTML'))

odds = []
for i in odd_element:    
    if i.get_attribute('innerHTML'):
        odds.append(i.get_attribute('innerHTML').replace(',','.'))
    

games = []
k = 0
j = 0
print(team_names)
print(odds)


if len(odds) == 3*len(team_names)/2:
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



driver.quit()

js1 = json.dumps(games)
js2 = json.dumps(title)

file = open('games.js','w')
file.write(f'const title = {js2}\n')
file.write(f'const games = {js1}')
file.close

