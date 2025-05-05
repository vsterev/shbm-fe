import {
  Container,
  Divider,
  Text,
  TextProps,
  useResponsiveClientValue,
  useTheme,
  View,
} from "reshaped";
import { Button } from "reshaped";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/auth.context";
import { LogOut } from "react-feather";
import { Moon, Sun } from "react-feather";

const navItems = [
  { path: "/bookings", label: "Bookings" },
  { path: "/history", label: "History" },
  { path: "/accommodations", label: "Map Accommodations" },
  { path: "/hotel-map", label: "Map Hotels" },
  { path: "/users", label: "Users" },
];

const Header = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { invertColorMode, colorMode } = useTheme();

  const responsiveText = useResponsiveClientValue<TextProps["variant"]>({
    s: "body-2", // For small devices
    l: "title-6", // For medium and larger devices
  });

  return (
    <View direction="column">
      <View
        direction="row"
        justify="space-between"
        align="center"
        padding={3}
        backgroundColor="neutral-faded"
      >
        <View direction="row" gap={2} borderRadius="small">
          {navItems.map(({ path, label }) => (
            <NavLink key={path} to={path}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "solid" : "outline"}
                  color="primary"
                >
                  {label}
                </Button>
              )}
            </NavLink>
          ))}
        </View>

        <View justify="start" width="40%" align="start">
          <Text variant={responsiveText} color="neutral-faded">
            Solvex Hotel Booking Manager
          </Text>
        </View>
        <View direction="row" gap={3} align="center">
          <Button
            variant="ghost"
            icon={colorMode === "light" ? Moon : Sun}
            onClick={invertColorMode}
          ></Button>
          <Text>user: </Text>
          <Text>{user?.name}</Text>
          <Button
            color="critical"
            variant="outline"
            onClick={() => navigate("/logout")}
            endIcon={<LogOut />}
          >
            Logout
          </Button>
        </View>
      </View>
      <Container width="97vw">
        <View backgroundColor="neutral">
          <Divider />
        </View>
      </Container>
    </View>
  );
};

export default Header;
