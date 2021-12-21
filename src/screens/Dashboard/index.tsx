import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "styled-components";
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadingContainer,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

export interface DatalistProps extends TransactionCardProps {
  id: string;
}

interface highlightProps {
  amount: string;
  lastTransaction: string;
}

interface highlightData {
  entries: highlightProps;
  expensive: highlightProps;
  total: highlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DatalistProps[]>([]);
  const [highlightData, setHighlightData] = useState<highlightData>(
    {} as highlightData
  );

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DatalistProps[],
    type: "positive" | "negative"
  ) {
    const collectionFilttered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFilttered.length === 0) return 0;
    const lastTransactions = new Date(
      Math.max.apply(
        Math,
        collectionFilttered.map((transaction) =>
          new Date(transaction.date).getTime()
        )
      )
    );

    return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString(
      "pt-BR",
      {
        month: "long",
      }
    )}`;
  }

  async function LoadTransactions() {
    let entriesTotal = 0;
    let expensiveTotal = 0;

    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    const transactionsFormatted: DatalistProps[] = transactions.map(
      (item: DatalistProps) => {
        if (item.type === "positive") {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }
        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "Brl",
        });
        const dateFormatted = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date: dateFormatted,
        };
      }
    );
    setTransactions(transactionsFormatted);

    const lastTransactionsEntries = getLastTransactionDate(
      transactions,
      "positive"
    );

    const lastTransactionsExpesives = getLastTransactionDate(
      transactions,
      "negative"
    );

    const totalInterval =
      lastTransactionsExpesives === 0
        ? `Não há transações de saída`
        : `01 a ${lastTransactionsExpesives}`;

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "Brl",
        }),
        lastTransaction: lastTransactionsEntries
          ? `Última entrada dia ${lastTransactionsEntries}`
          : `Não há transações`,
      },
      expensive: {
        amount: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "Brl",
        }),
        lastTransaction: lastTransactionsExpesives
          ? `Última entrada dia ${lastTransactionsExpesives}`
          : `Não há transações`,
      },
      total: {
        amount: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "Brl",
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  }

  useEffect(() => {
    LoadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      LoadTransactions();
    }, [])
  );
  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <TouchableOpacity>
                <LogoutButton onPress={signOut}>
                  <Icon name="power" />
                </LogoutButton>
              </TouchableOpacity>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransation={highlightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightData.expensive.amount}
              lastTransation={highlightData.expensive.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData.total.amount}
              lastTransation={highlightData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
