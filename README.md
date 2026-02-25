                 Usuário / Browser
                        |
                        v
             .-----------------------------.
             |        🐳 nginx_react        |
             |       (nginx + React)        |
             '--------------+--------------'
                            |
                ------------+------------
                |                         |
                v                         v
       .------------------.      .------------------.
       |   🐳 java_api     |      |   🐳 etl_java     |
       '---------+--------'      '---------+--------'
                 \                         /
                  \                       /
                   v                     v
                .----------------------.
                |     🐳 sqlserver      |
                '----------------------'

              (rede: luciano-network)



              https://brasil.io/dataset/covid19/caso_full/


              INSTRUÇÃO: Baixar o .csv no site acima e executar docker compose up
