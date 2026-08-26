import {
  Button,
  Card,
  FadeInView,
  IconBadge,
  PressableScale,
  SectionHeader,
  useToast,
  Wordmark,
} from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import {
  Category,
  getCategories,
  getMenuItems,
  MenuItem,
} from "@/src/api/menu";
import SideDrawer from "@/src/components/SideDrawer";
import { useCart } from "@/src/context/CartContext";
import { Chef, chefs } from "@/src/data/chefsData";
import { GalleryItem, galleryItems } from "@/src/data/galleryData";
import { Testimonial, testimonials } from "@/src/data/testimonialsData";
import { formatPrice } from "@/src/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GALLERY_GAP = Spacing.sm;
const GALLERY_TILE_SIZE =
  (SCREEN_WIDTH - Spacing.lg * 2 - GALLERY_GAP * 2) / 3;
const TESTIMONIAL_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;

const WHY_CHOOSE: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
}[] = [
  {
    icon: "leaf",
    title: "Fresh Ingredients",
    desc: "Sourced daily from trusted local suppliers.",
  },
  {
    icon: "bicycle",
    title: "Fast Delivery",
    desc: "Hot food at your door in 30 minutes or less.",
  },
  {
    icon: "ribbon",
    title: "Loved by Thousands",
    desc: "Rated 4.8+ by our happy regular customers.",
  },
  {
    icon: "shield-checkmark",
    title: "Hygiene Certified",
    desc: "Certified kitchens, strict quality standards.",
  },
];

const STATS: { label: string; target: number; suffix: string }[] = [
  { label: "Menu Items", target: 80, suffix: "+" },
  { label: "Happy Customers", target: 25000, suffix: "+" },
  { label: "Years of Service", target: 8, suffix: "" },
  { label: "Cities Served", target: 5, suffix: "" },
];

/* -------------------------------------------------------------------------- */
/* Sub-components (memoized — this screen is the most-reopened one)           */
/* -------------------------------------------------------------------------- */

const CategoryTile = React.memo(function CategoryTile({
  category,
  imageUrl,
  onPress,
}: {
  category: Category;
  imageUrl?: string;
  onPress: (category: Category) => void;
}) {
  const handlePress = useCallback(() => onPress(category), [category, onPress]);
  return (
    <PressableScale haptic style={styles.exploreTile} onPress={handlePress}>
      <View style={styles.exploreTileGradient}>
        <View style={styles.exploreTileImageWrap}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.exploreTileImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <Ionicons name="fast-food-outline" size={22} color={Colors.secondary} />
          )}
        </View>
        <Text style={styles.exploreTileText} numberOfLines={1}>
          {category.name}
        </Text>
      </View>
    </PressableScale>
  );
});

const FeaturedCard = React.memo(function FeaturedCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  const handleAdd = useCallback(() => onAdd(item), [item, onAdd]);
  const handlePress = useCallback(
    () => router.push({ pathname: "/item/[id]", params: { id: String(item.id) } }),
    [item.id],
  );
  return (
    <PressableScale onPress={handlePress} style={styles.featuredCard}>
      <LinearGradient
        colors={[Colors.primary, Colors.primary, Colors.secondary]}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featuredCardGradient}
      >
        <View style={styles.featuredImageWrap}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.featuredImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <Ionicons name="fast-food-outline" size={30} color="rgba(237,232,208,0.75)" />
          )}
        </View>
        <Text style={styles.featuredName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.featuredFooter}>
          <View style={styles.featuredPriceBadge}>
            <Text style={styles.featuredPrice}>{formatPrice(item.price)}</Text>
          </View>
          <PressableScale haptic scaleTo={0.85} onPress={handleAdd} style={styles.featuredAddButton}>
            <Ionicons name="add" size={16} color={Colors.bg} />
          </PressableScale>
        </View>
      </LinearGradient>
    </PressableScale>
  );
});

const ChefCard = React.memo(function ChefCard({
  chef,
  onPress,
}: {
  chef: Chef;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} style={styles.chefCard}>
      <View style={styles.chefCardGradient}>
        <Image
          source={{ uri: chef.image }}
          style={styles.chefImage}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <View style={styles.chefInfo}>
          <Text style={styles.chefName} numberOfLines={1}>
            {chef.name}
          </Text>
          <Text style={styles.chefRole} numberOfLines={1}>
            {chef.role}
          </Text>
          <Text style={styles.chefSpecialty} numberOfLines={2}>
            {chef.specialty}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
});

const GalleryTile = React.memo(function GalleryTile({
  item,
  onPress,
}: {
  item: GalleryItem;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} style={styles.galleryTile}>
      <Image
        source={{ uri: item.src }}
        style={styles.galleryImage}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
    </PressableScale>
  );
});

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <Card style={[styles.testimonialCard, { width: TESTIMONIAL_WIDTH }]}>
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name="star"
            size={14}
            color={i < item.rating ? Colors.secondary : Colors.borderStrong}
          />
        ))}
      </View>
      <Text style={styles.testimonialComment} numberOfLines={5}>
        &ldquo;{item.comment}&rdquo;
      </Text>
      <View style={styles.testimonialFooter}>
        <Avatar imageUrl={item.avatar} name={item.name} size={44} />
        <View style={{ marginLeft: Spacing.md, flex: 1 }}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialRole} numberOfLines={1}>
            {item.role} · {item.dish}
          </Text>
        </View>
      </View>
    </Card>
  );
}

function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Testimonial>>(null);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / TESTIMONIAL_WIDTH);
      setActiveIndex(idx);
    },
    [],
  );

  const renderItem = useCallback(({ item }: { item: Testimonial }) => (
    <TestimonialCard item={item} />
  ), []);

  return (
    <View>
      <FlatList
        ref={listRef}
        data={testimonials}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        snapToInterval={TESTIMONIAL_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
      />
      <View style={styles.dotsRow}>
        {testimonials.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

function CountUpStat({
  target,
  label,
  suffix,
}: {
  target: number;
  label: string;
  suffix: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const duration = 1200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>
        {value.toLocaleString("en-US")}
        {suffix}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

export default function HomeScreen() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryImages, setCategoryImages] = useState<
    Record<number, string | undefined>
  >({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [email, setEmail] = useState("");

  const floatY = useSharedValue(0);
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1400 }),
        withTiming(0, { duration: 1400 }),
      ),
      -1,
    );
  }, [floatY]);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  useEffect(() => {
    getMenuItems()
      .then((items) => {
        setFeaturedItems(items.filter((i) => i.is_featured));
        const images: Record<number, string | undefined> = {};
        for (const item of items) {
          if (item.image && !images[item.category_id]) {
            images[item.category_id] = item.image;
          }
        }
        setCategoryImages(images);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleAddToCart = useCallback(
    (item: MenuItem) => {
      addToCart(item);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      showToast(`${item.name} added to cart`, { icon: "cart" });
    },
    [addToCart, showToast],
  );

  const handleCategoryPress = useCallback((category: Category) => {
    router.push({
      pathname: "/(tabs)/menu",
      params: { categoryId: String(category.id) },
    });
  }, []);

  const handleSubscribe = useCallback(() => {
    if (!email.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showToast("You're subscribed! \u{1F389}");
    setEmail("");
  }, [email, showToast]);

  const goToChefs = useCallback(() => router.push("/chefs"), []);
  const goToGallery = useCallback(() => router.push("/gallery"), []);
  const goToReservation = useCallback(
    () => router.push("/reservation"),
    [],
  );

  const renderFeaturedItem = useCallback(
    ({ item }: { item: MenuItem }) => (
      <FeaturedCard item={item} onAdd={handleAddToCart} />
    ),
    [handleAddToCart],
  );

  const renderChefItem = useCallback(
    ({ item }: { item: Chef }) => <ChefCard chef={item} onPress={goToChefs} />,
    [goToChefs],
  );

  const todaysSpecial = featuredItems[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Top Bar */}
      <View style={styles.fixedHeader}>
        <View style={styles.topBar}>
          <PressableScale haptic onPress={() => setDrawerVisible(true)}>
            <Ionicons name="menu" size={26} color={Colors.text} />
          </PressableScale>

          <PressableScale
            style={styles.addressSelector}
            onPress={() => showToast("Address selection coming soon")}
          >
            <Ionicons name="location-outline" size={16} color={Colors.text} />
            <Text style={styles.addressText} numberOfLines={1}>
              No Address Selected
            </Text>
          </PressableScale>

          <Wordmark size={16} />
        </View>

        {/* Order Type Row */}
        <View style={styles.orderTypeRow}>
          <PressableScale
            haptic
            style={styles.orderTypeChip}
            onPress={() => router.push("/(tabs)/menu")}
          >
            <Ionicons name="bicycle" size={18} color={Colors.secondary} />
            <Text style={styles.orderTypeChipText}>Delivery</Text>
          </PressableScale>
          <PressableScale
            haptic
            style={styles.orderTypeChip}
            onPress={() => router.push("/(tabs)/menu")}
          >
            <Ionicons name="storefront-outline" size={18} color={Colors.secondary} />
            <Text style={styles.orderTypeChipText}>Pickup</Text>
          </PressableScale>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=1500&fit=crop&auto=format&q=80",
            }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.92)"]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroContentWrap}>
            <View style={styles.heroContent}>
              <View style={styles.heroBadgeWrap}>
                <View style={styles.heroBadge}>
                  <Ionicons name="flame" size={12} color={Colors.primary} />
                  <Text style={styles.heroBadgeText}>
                    Award-Winning Restaurant Since 2003
                  </Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>
                Delicious Food,{" "}
                <Text style={styles.heroTitleAccent}>Great</Text> Experience
              </Text>
              <Text style={styles.heroSubtitle}>
                Where world-class chefs transform the finest ingredients into
                unforgettable dining moments.
              </Text>
              <View style={styles.heroCtaRow}>
                <Button
                  title="Book A Table"
                  onPress={goToReservation}
                  fullWidth={false}
                  size="md"
                  style={{ alignSelf: "center", minWidth: 160, paddingVertical: 16 }}
                  icon={<Ionicons name="call" size={14} color={Colors.bg} />}
                />
                <PressableScale
                  haptic
                  style={styles.heroCtaSecondary}
                  onPress={() => router.push("/(tabs)/menu")}
                >
                  <Ionicons name="restaurant-outline" size={15} color={Colors.white} />
                  <Text style={styles.heroCtaSecondaryText}>Explore Menu</Text>
                </PressableScale>
              </View>
              <View style={styles.heroStatsRow}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>4.9★</Text>
                  <Text style={styles.heroStatLabel}>Rating</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>50K+</Text>
                  <Text style={styles.heroStatLabel}>Happy Guests</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>120+</Text>
                  <Text style={styles.heroStatLabel}>Menu Items</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Promo Banner */}
        <LinearGradient
          colors={[Colors.primary, Colors.primary, Colors.secondary]}
          locations={[0, 0.65, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerTitle}>Free Delivery</Text>
            <Text style={styles.bannerSubtitle}>On orders above Rs. 1500</Text>
          </View>
          <Ionicons name="bicycle" size={48} color={Colors.bg} style={{ opacity: 0.9 }} />
        </LinearGradient>

        {/* Explore Menu Grid */}
        <SectionHeader
          title="Explore Menu"
          onAction={() => router.push("/(tabs)/menu")}
          style={styles.sectionHeader}
        />

        <View style={styles.exploreGrid}>
          {categories.map((cat) => (
            <CategoryTile
              key={cat.id}
              category={cat}
              imageUrl={categoryImages[cat.id]}
              onPress={handleCategoryPress}
            />
          ))}
        </View>

        {/* Featured Items */}
        <SectionHeader
          eyebrow="TRENDING"
          title="Popular Right Now"
          style={styles.sectionHeader}
        />

        {loading ? (
          <ActivityIndicator size="large" color={Colors.secondary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={featuredItems}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.featuredList}
            renderItem={renderFeaturedItem}
            removeClippedSubviews
          />
        )}

        {/* Today's Special */}
        {todaysSpecial ? (
          <View style={styles.specialSection}>
            <View style={styles.specialBadge}>
              <Ionicons name="star" size={12} color={Colors.bg} />
              <Text style={styles.specialBadgeText}>Chef&apos;s Recommendation</Text>
            </View>
            <Animated.View style={[styles.specialImageWrap, floatStyle]}>
              {todaysSpecial.image ? (
                <Image
                  source={{ uri: todaysSpecial.image }}
                  style={styles.specialImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              ) : (
                <Ionicons name="fast-food-outline" size={56} color={Colors.bg} />
              )}
            </Animated.View>
            <Text style={styles.specialEyebrow}>TODAY&apos;S SPECIAL</Text>
            <Text style={styles.specialName}>{todaysSpecial.name}</Text>
            {todaysSpecial.description ? (
              <Text style={styles.specialDesc} numberOfLines={3}>
                {todaysSpecial.description}
              </Text>
            ) : null}
            <Text style={styles.specialPrice}>{formatPrice(todaysSpecial.price)}</Text>
            <Button
              title="Order Now"
              onPress={() => handleAddToCart(todaysSpecial)}
              style={{ marginTop: Spacing.lg, alignSelf: "center" }}
              fullWidth={false}
            />
          </View>
        ) : null}

        {/* Why Choose Hot & Spice */}
        <SectionHeader
          eyebrow="WHY US"
          title="Why Choose Hot & Spice"
          style={styles.sectionHeader}
        />
        <View style={styles.whyGrid}>
          {WHY_CHOOSE.map((w, i) => (
            <FadeInView key={w.title} index={i} style={styles.whyCard}>
              <View style={styles.whyCardGradient}>
                <IconBadge name={w.icon} style={{ marginBottom: Spacing.sm }} />
                <Text style={styles.whyTitle}>{w.title}</Text>
                <Text style={styles.whyDesc}>{w.desc}</Text>
              </View>
            </FadeInView>
          ))}
        </View>

        {/* Stats Band */}
        <LinearGradient
          colors={[Colors.primary, Colors.primary, Colors.secondary]}
          locations={[0, 0.65, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsBand}
        >
          <View style={styles.statsRow}>
            {STATS.map((s) => (
              <CountUpStat key={s.label} {...s} />
            ))}
          </View>
        </LinearGradient>

        {/* Meet Our Chefs */}
        <SectionHeader
          eyebrow="OUR TEAM"
          title="Meet Our Chefs"
          onAction={goToChefs}
          style={styles.sectionHeader}
        />
        <FlatList
          data={chefs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => c.id}
          renderItem={renderChefItem}
          contentContainerStyle={styles.chefList}
        />

        {/* Testimonials */}
        <SectionHeader
          eyebrow="TESTIMONIALS"
          title="What Our Guests Say"
          style={styles.sectionHeader}
        />
        <TestimonialsCarousel />

        {/* Reserve a Table CTA */}
        <View style={styles.section}>
          <Card variant="warm" style={styles.reserveCard}>
            <IconBadge name="calendar" style={{ marginBottom: Spacing.sm }} />
            <Text style={styles.reserveTitle}>Reserve a Table</Text>
            <Text style={styles.reserveDesc}>
              Planning something special? Book your table in seconds.
            </Text>
            <Button
              title="Reserve Now"
              onPress={goToReservation}
              style={{ marginTop: Spacing.md, backgroundColor: Colors.bg }}
              textStyle={{ color: Colors.secondary }}
            />
          </Card>
        </View>

        {/* Gallery Preview */}
        <SectionHeader
          eyebrow="GALLERY"
          title="A Taste of the Experience"
          onAction={goToGallery}
          style={styles.sectionHeader}
        />
        <View style={styles.galleryGrid}>
          {galleryItems.slice(0, 6).map((g) => (
            <GalleryTile key={g.id} item={g} onPress={goToGallery} />
          ))}
        </View>

        {/* Get Exclusive Offers */}
        <View style={styles.section}>
          <Card style={styles.newsletterCard}>
            <Text style={styles.newsletterTitle}>Get Exclusive Offers</Text>
            <Text style={styles.newsletterDesc}>
              Subscribe for deals, new menu drops, and more.
            </Text>
            <View style={styles.newsletterRow}>
              <TextInput
                style={styles.newsletterInput}
                placeholder="Your email address"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Button
                title="Subscribe"
                onPress={handleSubscribe}
                fullWidth={false}
                style={styles.newsletterButton}
              />
            </View>
          </Card>
        </View>

        {/* Location Card */}
        <View style={styles.section}>
          <Card style={styles.locationCard}>
            <View style={styles.locationRow}>
              <IconBadge name="location" />
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.locationTitle}>Visit Us</Text>
                <Text style={styles.locationText}>Lahore, Pakistan</Text>
              </View>
            </View>
            <Button
              title="Get Directions"
              variant="outline"
              onPress={() =>
                Linking.openURL("https://www.google.com/maps?q=Lahore,+Pakistan")
              }
              style={{ marginTop: Spacing.md }}
            />
          </Card>
        </View>

        <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },

  fixedHeader: {
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  addressSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  addressText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },

  orderTypeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  orderTypeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.bgMuted,
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  orderTypeChipText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    color: Colors.text,
  },

  hero: {
    height: 460,
    overflow: "hidden",
  },
  heroContentWrap: {
    flex: 1,
    justifyContent: "flex-end",
  },
  heroContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  heroBadgeWrap: {
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,61,0,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,61,0,0.4)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  heroBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },
  heroTitle: {
    fontSize: FontSize["8xl"],
    lineHeight: 38,
    fontFamily: FontFamily.extraBold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  heroTitleAccent: { color: Colors.primary },
  heroSubtitle: {
    fontSize: FontSize.md,
    lineHeight: 20,
    fontFamily: FontFamily.regular,
    color: "rgba(255,255,255,0.75)",
    marginBottom: Spacing.xl,
  },
  heroCtaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  heroCtaSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minWidth: 160,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 16,
  },
  heroCtaSecondaryText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  heroStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    paddingTop: Spacing.lg,
  },
  heroStatItem: { flex: 1, alignItems: "center" },
  heroStatValue: {
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    color: Colors.white,
  },
  heroStatLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: "rgba(255,255,255,0.55)",
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  banner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius["2xl"],
    padding: Spacing.xl - 2,
    ...Shadows.warm,
  },
  bannerTextWrap: {},
  bannerTitle: { fontSize: FontSize["3xl"], fontFamily: FontFamily.extraBold, color: Colors.bg },
  bannerSubtitle: { fontSize: FontSize.base, color: Colors.bg, marginTop: 2, fontFamily: FontFamily.medium },

  sectionHeader: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing["2xl"],
    marginBottom: Spacing.md,
  },
  section: { marginHorizontal: Spacing.lg, marginTop: Spacing["2xl"] },

  exploreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  exploreTile: {
    width: "30%",
  },
  exploreTileGradient: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    backgroundColor: Colors.secondaryTint,
    ...Shadows.card,
  },
  exploreTileImageWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  exploreTileImage: { width: "100%", height: "100%" },
  exploreTileText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
    textAlign: "center",
  },

  featuredList: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  featuredCard: {
    width: 140,
    marginRight: Spacing.md,
  },
  featuredCardGradient: {
    borderRadius: Radius.xl,
    padding: Spacing.sm + 2,
    ...Shadows.card,
  },
  featuredImageWrap: {
    width: "100%",
    height: 80,
    borderRadius: Radius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  featuredImage: { width: "100%", height: "100%" },
  featuredName: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: Colors.bg,
    marginBottom: Spacing.sm,
  },
  featuredFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredPriceBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  featuredPrice: { fontSize: FontSize.sm, fontFamily: FontFamily.extraBold, color: Colors.secondary },
  featuredAddButton: {
    backgroundColor: Colors.secondary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Today's Special */
  specialSection: {
    marginTop: Spacing["2xl"],
    backgroundColor: Colors.dark,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing["2xl"],
    alignItems: "center",
  },
  specialBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginBottom: Spacing.lg,
  },
  specialBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: Colors.bg,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  specialImageWrap: {
    width: 200,
    height: 200,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...Shadows.floating,
  },
  specialImage: { width: "100%", height: "100%" },
  specialEyebrow: {
    marginTop: Spacing.xl,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: Colors.secondaryLight,
    letterSpacing: 1.2,
  },
  specialName: {
    marginTop: Spacing.xs,
    fontSize: FontSize["7xl"],
    fontFamily: FontFamily.extraBold,
    color: Colors.bg,
    textAlign: "center",
  },
  specialDesc: {
    marginTop: Spacing.sm,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  specialPrice: {
    marginTop: Spacing.md,
    fontSize: FontSize["6xl"],
    fontFamily: FontFamily.extraBold,
    color: Colors.secondaryLight,
  },

  /* Why choose */
  whyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  whyCard: {
    width: "47%",
  },
  whyCardGradient: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  whyTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  whyDesc: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.muted,
    lineHeight: 17,
  },

  /* Stats band */
  statsBand: {
    marginTop: Spacing["2xl"],
    paddingVertical: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
  },
  statsRow: { flexDirection: "row", flexWrap: "wrap" },
  statItem: { width: "50%", alignItems: "center", marginBottom: Spacing.lg },
  statValue: {
    fontSize: FontSize["6xl"],
    fontFamily: FontFamily.extraBold,
    color: Colors.bg,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: "rgba(237,232,208,0.85)",
    marginTop: 2,
  },

  /* Chefs */
  chefList: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  chefCard: {
    width: 160,
    marginRight: Spacing.md,
  },
  chefCardGradient: {
    borderRadius: Radius.xl,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  chefImage: { width: "100%", height: 160, backgroundColor: Colors.bgMuted },
  chefInfo: { padding: Spacing.md },
  chefName: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.text },
  chefRole: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    color: Colors.secondary,
    marginTop: 2,
    marginBottom: 4,
  },
  chefSpecialty: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.muted,
    lineHeight: 15,
  },

  /* Testimonials */
  testimonialCard: { marginRight: 0 },
  starsRow: { flexDirection: "row", gap: 2, marginBottom: Spacing.sm },
  testimonialComment: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    lineHeight: 21,
    fontStyle: "italic",
  },
  testimonialFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  testimonialName: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.text },
  testimonialRole: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.muted, marginTop: 2 },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: Spacing.md,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.secondary, width: 18 },

  /* Reserve CTA */
  reserveCard: { alignItems: "center" },
  reserveTitle: { fontSize: FontSize["4xl"], fontFamily: FontFamily.extraBold, color: Colors.text },
  reserveDesc: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.muted,
    textAlign: "center",
    marginTop: 4,
  },

  /* Gallery */
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.lg,
    gap: GALLERY_GAP,
  },
  galleryTile: {
    width: GALLERY_TILE_SIZE,
    height: GALLERY_TILE_SIZE,
    borderRadius: Radius.md,
    overflow: "hidden",
    backgroundColor: Colors.bgMuted,
  },
  galleryImage: { width: "100%", height: "100%" },

  /* Newsletter */
  newsletterCard: {},
  newsletterTitle: { fontSize: FontSize["4xl"], fontFamily: FontFamily.extraBold, color: Colors.secondary },
  newsletterDesc: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.muted,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  newsletterRow: { gap: Spacing.sm },
  newsletterInput: {
    backgroundColor: Colors.bgAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
  },
  newsletterButton: { alignSelf: "stretch" },

  /* Location */
  locationCard: {},
  locationRow: { flexDirection: "row", alignItems: "center" },
  locationTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.text },
  locationText: { fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.muted, marginTop: 2 },
});
