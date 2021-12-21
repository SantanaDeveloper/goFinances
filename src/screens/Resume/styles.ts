import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BorderlessButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  flex: 1;
`;
export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  height: ${RFValue(133)}px;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 19px;
`;
export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.shape};
  font-size: ${RFValue(18)}px;
`;

export const Content = styled.ScrollView``;

export const ChartContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const MonthSelect = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;
export const MonthSelectButton = styled(BorderlessButton)``;
export const MonthSelectIcon = styled(Feather)`
  font-size: ${RFValue(24)}px;
`;
export const Month = styled.Text`
  font-size: ${RFValue(20)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
