# 测试用例

## 1. id*(id+id)
```
E->TE'                      E->TE'
 ->FT'E'                    T->FT'
 ->idT'E'                   F->id
 ->id*FT'E'                 T'->*FT'
 ->id*(E)T'E'               F->(E)
 ->id*(TE')T'E'             E->TE'
 ->id*(FT'E')T'E'           T->FT'
 ->id*(idT'E')T'E'          F->id
 ->id*(idE')T'E'            T'->ε
 ->id*(id+TE')T'E'          E'->+TE'
 ->id*(id+FT'E')T'E'        T->FT'
 ->id*(id+idT'E')T'E'       F->id
 ->id*(id+idE')T'E'         T'->ε
 ->id*(id+id)T'E'           E'->ε
 ->id*(id+id)E'             T'->ε
 ->id*(id+id)               E'->ε
```

## 2. id\*id+id\*id
```
E->TE'                      E->TE'
 ->FT'E'                    T->FT'
 ->idT'E'                   F->id
 ->id*FT'E'                 T'->*FT'
 ->id*idT'E'                F->id
 ->id*idE'                  T'->ε
 ->id*id+TE'                E'->+TE'
 ->id*id+FT'E'              T->FT'
 ->id*id+idT'E'             F->id
 ->id*id+id*FT'E'           T'->*FT'
 ->id*id+id*idT'E'          F->id
 ->id*id+id*idE'            T'->ε
 ->id*id+id*id              E'->ε
```

## 3. id\*id++id\*id
```
E->TE'                      E->TE'
 ->FT'E'                    T->FT'
 ->idT'E'                   F->id
 ->id*FT'E'                 T'->*FT'
 ->id*idT'E'                F->id
 ->id*idE'                  T'->ε
 ->id*id+TE'                E'->+TE'
 ->skip "+"
 ->id*id+FT'E'              T->FT'
 ->id*id+idT'E'             F->id
 ->id*id+id*FT'E'           T'->*FT'
 ->id*id+id*idT'E'          F->id
 ->id*id+id*idE'            T'->ε
 ->id*id+id*id              E'->ε
```

## 2. id\*id+id\*)id
```
E->TE'                      E->TE'
 ->FT'E'                    T->FT'
 ->idT'E'                   F->id
 ->id*FT'E'                 T'->*FT'
 ->id*idT'E'                F->id
 ->id*idE'                  T'->ε
 ->id*id+TE'                E'->+TE'
 ->id*id+FT'E'              T->FT'
 ->id*id+idT'E'             F->id
 ->id*id+id*FT'E'           T'->*FT'
 ->skip ")"
 ->id*id+id*idT'E'          F->id
 ->id*id+id*idE'            T'->ε
 ->id*id+id*id              E'->ε
```

## 3. id**id+id)
```
E->TE'              E->TE'
 ->FT'E'            T->FT'
 ->idT'E'           F->id
 ->id*FT'E'         T'->*FT'
 ->skip "*"
 ->id*idT'E'        F->id
 ->id*idE'          T'->ε
 ->id*id+TE'        E'->+TE'
 ->id*id+FT'E'      T->FT'
 ->id*id+idT'E'     F->id
 ->id*id+idE'       T'->ε
 ->id*id+id         T'->ε
 ->skip ")"         
```

## 4.idid*id+idid
```
E->TE'              E->TE'
 ->FT'E'            T->FT'
 ->idT'E'           F->id
 ->skip id
 ->id*FT'E'         T'->*FT'
 ->id*idT'E'        T'->*FT'
 ->id*idE'          T'->ε
 ->id*id+TE'        E'->+TE'
 ->id*id+FT'E'      T->FT'
 ->id*id+idT'E'     F->id
 ->skip id
 ->id*id+idE'       T'->ε
 ->id*id+id         E'->ε
```
